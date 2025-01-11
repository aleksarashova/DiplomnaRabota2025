import * as Yup from "yup";

export const userRegisterSchema = Yup.object().shape({
    first_name: Yup.string()
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters.")
        .max(15, "First name must not exceed 15 characters."),

    last_name: Yup.string()
        .required("Last name is required.")
        .min(2, "Last name must be at least 2 characters.")
        .max(15, "Last name must not exceed 15 characters."),

    email: Yup.string()
        .required("Email is required.")
        .email("Invalid email address."),

    username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username must not exceed 20 characters."),

    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters."),

    admin_code: Yup.string()
        .notRequired()
        .oneOf([process.env.ADMIN_CODE, ""], "Invalid admin code."),
})

export const userLoginSchema = Yup.object().shape({
    username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must not exceed 20 characters"),

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
})

export const profileUpdateSchema = Yup.object({
    field: Yup.string()
        .required("Field is required")
        .oneOf(["email", "username", "password", "bio"], "Invalid field name"),
    value: Yup.lazy((_, { parent }) => {
        switch (parent.field) {
            case "email":
                return Yup.string()
                    .required("Email is required")
                    .email("Invalid email address")
                    .test(
                        "no-newlines",
                        "Email must not contain newlines",
                        (value) => !/\n/.test(value || "")
                    );
            case "username":
                return Yup.string()
                    .required("Username is required")
                    .min(3, "Username must be at least 3 characters")
                    .max(20, "Username must not exceed 20 characters")
                    .test(
                        "no-newlines",
                        "Username must not contain newlines",
                        (value) => !/\n/.test(value || "")
                    );
            case "password":
                return Yup.string()
                    .required("Password is required")
                    .min(8, "Password must be at least 8 characters")
                    .test(
                        "no-newlines",
                        "Password must not contain newlines",
                        (value) => !/\n/.test(value || "")
                    );
            case "bio":
                return Yup.string()
                    .max(250, "Bio must not exceed 250 characters");
            default:
                return Yup.mixed().notRequired();
        }
    }),
})



