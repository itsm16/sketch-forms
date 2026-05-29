import z from "zod";

const CreateFormInput = z.object({
    userId: z.string().describe("User ID").nonempty("User ID is required"),
    title: z.string().min(1).max(30).describe("Form title").nonempty("Title is required"),
    tagline: z.string().min(1).max(50).describe("Form tagline").nonempty("Tagline is required").optional(),
    canvasJson: z.any().describe("Canvas JSON"),
    // noExpiration: z.boolean().default(false).describe("No expiration date").default(true),
});

// types
type CreateFormInputType = z.infer<typeof CreateFormInput>;

export type {
    CreateFormInputType,
};

export {
    CreateFormInput,
};