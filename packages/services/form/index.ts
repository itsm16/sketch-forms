import db, { eq } from "@repo/database";
import { CreateFormInputType } from "./model";
import { formsTable } from "@repo/database/models/form";

class FormService {
    private async createForm(payload : CreateFormInputType) {
        const { userId, title, tagline, canvasJson } = payload;
        
        const [form] = await db.insert(formsTable).values({
            userId,
            title,
            tagline,
            canvasJson
        }).returning();
        
        if(!form) {
            throw new Error("Failed to create form");
        }

        return { form };
    }
    
    private async getFormById(id: string) {
        const form = await db.select().from(formsTable).where(eq(formsTable.id, id));
        return { form };
    }
    
    private async getFormsByUserId(userId: string) {
        const forms = await db.select().from(formsTable).where(eq(formsTable.userId, userId));
        return { forms };
    }
    
    private async updateForm(id: string, payload: Partial<CreateFormInputType>) {
        const [form] = await db.update(formsTable).set(payload).where(eq(formsTable.id, id)).returning();
        
        if(!form) {
            throw new Error("Failed to update form");
        }
        
        return { form };
    }
    
    private async deleteForm(id: string) {
        const [form] = await db.delete(formsTable).where(eq(formsTable.id, id)).returning();

        if(!form) {
            throw new Error("Failed to delete form");
        }
        
        return { form };
    }
}

export default FormService