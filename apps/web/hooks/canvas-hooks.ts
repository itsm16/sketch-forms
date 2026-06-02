import { api } from "~/trpc/server";

export const useForms = () => {
    const createForm = async (userId: string, title: string, tagline: string, canvasJson: any) => {
        const {id} = await api.form.CreateForm.mutate({userId, title, tagline, canvasJson});
        return id;
    };
    
    return {
        createForm,
    };
};
