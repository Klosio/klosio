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
    const prompt =
        promptWithVariables ||
        `
    "Aide un commercial dans l'industrie $industry$ vendant $selling$ à des clients de type $target$, à formuler une réponse au problème d'un client à l'aide des réponses proposées.
    Voici le proplème posé par le client, et les réponses possibles :

    Problème :
    $question$
    
    Réponses possibles :
    $painpoints$
    
    Réponds en fonction de ces réponses exclusivement. Si tu n'a pas suffisament d'information dans le problème formulé ou que tu ne sais pas quoi répondre, ne repond rien.
    Retourne la réponse que tu as formulée, ainsi que le problème reformulé sous la forme d'une question simple.
    
    Renvoie la réponse dans un format JSON avec les clés 'question' et 'answer'. Si tu n'as pas répondu à la question, renvoie une réponse vide."
    `

    return replacePlaceholders(prompt, variables)
}

export { getPrompt, PromptVariables }
