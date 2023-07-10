import { Analysis } from "~/constants/analysis"

interface PromptVariables {
    industry: string
    selling: string
    target: string
    question: string
    painpoints: string
}

type PromptVariable =
    | "industry"
    | "selling"
    | "target"
    | "question"
    | "painpoints"

// Replaces placeholders in between "$" in the template
function replacePlaceholders(
    template: string,
    variables: PromptVariables
): string {
    const placeholders = template.match(/\$(.*?)\$/g)

    if (!placeholders || !placeholders.length) {
        return template
    }

    const placeholderNames = placeholders.map((placeholder) =>
        placeholder.substring(1, placeholder.length - 1)
    )

    let result = template
    placeholderNames.forEach((placeholderName) => {
        if (Object.keys(variables).includes(placeholderName)) {
            const variable = placeholderName as PromptVariable
            result = result.replace("$" + variable + "$", variables[variable])
        }
    })
    return result
}

function getPrompt(
    promptWithVariables: string | undefined,
    variables: PromptVariables
): string {
    const prompt = promptWithVariables || Analysis.PROMPT

    return replacePlaceholders(prompt, variables)
}

export { getPrompt, PromptVariables }
