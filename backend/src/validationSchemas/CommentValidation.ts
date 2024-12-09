import * as Yup from "yup";

export const addCommentSchema = Yup.object().shape({
        content: Yup.string()
            .required("Comment is required.")
            .max(500, "Comment is too long.")
            .test(
                "not-blank",
                "Comment cannot consist only of spaces or new lines.",
                (value) => !!value && value.trim().length > 0
            )
    }
)