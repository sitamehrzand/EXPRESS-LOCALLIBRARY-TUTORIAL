const Author = require("../models/author");
const Book = require("../models/book")
const { body, validationResult } = require("express-validator");
// Display list of all Authors.
exports.author_list = async (req, res, next) => {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
    res.render("author_list", {
        title: "Author List",
        author_list: allAuthors
    })
};

// Display detail page for a specific Author.
exports.author_detail = async (req, res, next) => {
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summery").exec()
    ]);

    if (author === null) {
        const err = new Error("Author not found.");
        err.status = 404;
        return next(err);
    }

    res.render("author_detail", {
        title: "Author Detail",
        author,
        author_books: allBooksByAuthor
    })
};

// Display Author create form on GET.
exports.author_create_get = async (req, res, next) => {
    res.render("author_form", {
        title: "Create Author"
    })
};

// Handle Author create on POST.
exports.author_create_post = [
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("date_of_death", "Invalid date of death")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    async (req, res, next) => {
        const errors = validationResult(req);

        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });

        if (!errors.isEmpty()) {
            res.render("author_form", {
                title: "Create Author",
                author,
                errors: errors.array(),
            })
            return;
        }

        await author.save();
        res.redirect(author.url)
    }
]

// Display Author delete form on GET.
exports.author_delete_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete on POST.
exports.author_delete_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET.
exports.author_update_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST");
};