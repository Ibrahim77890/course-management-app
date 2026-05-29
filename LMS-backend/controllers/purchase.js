const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cart");
const Courses = require("../models/course");
const {
    generateEnrollmentKey,
    encryptKey,
} = require("../config/enrollmentEncrypt");
const { default: Stripe } = require("stripe");
const Users = require("../models/user");
const Transactions = require("../models/Transaction");

//@desc Return User Cart
//@route Get /
//@access private
const getUserCart = expressAsyncHandler(async (req, res) => {
    try {
        console.log(req.user);
        const userId = req.user._id;
        let cart = await Cart.findOne({ currentUser: userId }).populate(
            "items.courseId",
            "title instructor price"
        );

        if (!cart) {
            cart = new Cart({ currentUser: userId });
            await cart.save();
        }

        let totalPrice = 0.0;
        if (cart.items.length > 0) {
            totalPrice = cart.items.reduce((total, item) => {
                return total + item.courseId.price * item.quantity;
            }, 0);
        }

        res.status(200).json({
            message: "User cart returned successfully",
            userCart: cart,
            totalPrice,
        });
    } catch (error) {
        console.error("Error retrieving user cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//@desc Add a course to user cart
//@route POST /addToCart
//@access private
const addCourseToCart = expressAsyncHandler(async (req, res, next) => {
    try {
        console.log("ghq2", req.user);
        const userId = req.user._id;
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        let cart = await Cart.findOne({ currentUser: userId });
        if (!cart) {
            cart = new Cart({ currentUser: userId, items: [] });
        }
        cart = await cart.addItem(courseId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//@desc Remove a single instance of that course from user cart
//@route POST /deleteFromCart
//@access private
const deleteCourseFromCart = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ currentUser: userId });
        if (!cart) {
            res.status(400).json({ message: "No user cart found" });
        }
        const { courseId } = req.body;
        if (!courseId) {
            res.status(400).json({ message: "No course ID found" });
        }

        await cart.removeItem(courseId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//@desc Remove complete instance of that course from user cart
//@route POST /removeFromCart
//@access private
const removeCourseFromCart = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ currentUser: userId });

        if (!cart) {
            return res.status(400).json({ message: "No user cart found" });
        }

        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "No course ID found" });
        }

        const cartItemIndex = cart.items.findIndex(
            (item) => item.courseId.toString() === courseId.toString()
        );

        if (cartItemIndex !== -1) {
            cart.items.splice(cartItemIndex, 1);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res
                .status(404)
                .json({ message: "Course not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//@desc Stripe payment  method for the user to payment successful to generate keys for himself
//@route POST /purchase
//@access private
const stripePaymentGateway = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await Users.findById(userId);
        let cart = await Cart.findOne({ currentUser: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for current user" });
        }

        let cartItems = cart.items;

        let courses = [];
        for (let item of cartItems) {
            let course = await Courses.findById(item.courseId);
            console.log(item);
            courses.push({
                ...course.toObject(), // Convert Mongoose document to plain JavaScript object
                quantity: item.quantity,
            });
        }

        console.log(courses);

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        console.log("Hira hira hira");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `http://localhost:3000/lms-cart-success`,
            cancel_url: `http://localhost:3000/cart`,
            customer_email: user.email,
            client_reference_id: cart._id.toString(), // Ensure _id is a string
            line_items: courses.map((item) => ({
                price_data: {
                    currency: "usd",
                    unit_amount: item.price * 100, // Ensure the amount is in cents
                    product_data: {
                        name: item.title,
                        description: item.description,
                    },
                },
                quantity: item.quantity,
            })),
        });

        console.log(session)

        const purchases = new Transactions({
            user: user._id,
            session: session.id,
        });

        await purchases.save();
        res.status(200).json({ message: "Successful payment", session });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error at payment", error });
        console.log(error);
    }
});


const postEnrollments = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const modifiedCart = req.body.cart;
        let cart = await Cart.findOne({ currentUser: userId });

        if (!cart) {
            return res.status(400).json({ message: "No user cart found" });
        }

        for (const updatedItem of modifiedCart) {
            const { courseId, quantity } = updatedItem;

            const originalItem = cart.items.find(
                (item) => item.courseId.toString() === courseId
            );
            if (originalItem) {
                originalItem.quantity = quantity;
            }
        }

        await cart.save();

        const enrollmentKeys = [];

        for (const item of cart.items) {
            const { courseId, quantity } = item;

            const course = await Courses.findById(courseId);
            if (!course) {
                return res
                    .status(404)
                    .json({ error: `Course with id ${courseId} not found` });
            }

            if (!course.enrollmentKey) {
                course.enrollmentKey = []; // Initialize the enrollmentKey array if not present
            }

            for (let i = 0; i < quantity; i++) {
                const key = generateEnrollmentKey();
                const encryptedKey = encryptKey(key, process.env.SECRET_KEY);
                course.enrollmentKey.push(encryptedKey);
                enrollmentKeys.push(encryptedKey);
            }

            await course.save();
        }

        await Cart.findOneAndDelete({ currentUser: userId });
        console.log(enrollmentKeys)

        res.status(209).json({
            message: "Enrollment keys generated successfully",
            enrollmentKeys,
        });
    } catch (error) {
        console.error("Error generating enrollment keys:", error); // Log the detailed error
        res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
});

const printEnrollmentKey = expressAsyncHandler(async (req, res, next) => {
    const enrollmentKey = Courses.find
});

module.exports = {
    addCourseToCart,
    deleteCourseFromCart,
    removeCourseFromCart,
    getUserCart,
    postEnrollments,
    stripePaymentGateway,
};
