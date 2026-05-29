import db, { eq } from "@repo/database";
import { CreateFormInputType } from "./model";
import { formsTable } from "@repo/database/models/form";

class FormService {
    public async createForm(payload : CreateFormInputType) {
        const { userId, title, tagline, canvasJson } = payload;

        const [form] = await db.insert(formsTable).values({
            userId,
            title,
            canvasJson
        }).returning();
        
        return { form };
    }
    
    public async getFormById(id: string) {
        const form = await db.select().from(formsTable).where(eq(formsTable.id, id));
        return { form };
    }
    
    public async getFormsByUserId(userId: string) {
        const forms = await db.select().from(formsTable).where(eq(formsTable.userId, userId));
        return { forms };
    }
    
    public async updateForm(id: string, payload: Partial<CreateFormInputType>) {
        const [form] = await db.update(formsTable).set(payload).where(eq(formsTable.id, id)).returning();
        return { form };
    }
    
    public async deleteForm(id: string) {
        const [form] = await db.delete(formsTable).where(eq(formsTable.id, id)).returning();
        return { form };
    }
}

export default FormService