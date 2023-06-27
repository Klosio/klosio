import Option from "../types/Option"
import { supabaseClient } from "../util/supabase"

interface OptionRepository {
    findByName(name: string): Promise<Option>
    save(option: Option): Promise<Option>
}

const optionRepository: OptionRepository = {
    async findByName(name: string): Promise<Option> {
        const { data, error } = await supabaseClient
            .from("options")
            .select("name, value")
            .eq("name", name)
            .single()

        if (error) {
            throw new Error(`Error when retrieving option with name ${name}`, {
                cause: error
            })
        }
        return data
    },
    async save(option: Option): Promise<Option> {
        const { data, error } = await supabaseClient
            .from("options")
            .upsert(option)
            .select()
            .single()
        if (error) {
            throw new Error(
                `Error when saving option with name ${option.name} and value ${option.value}`,
                { cause: error }
            )
        }
        return data
    }
}

export { optionRepository }
