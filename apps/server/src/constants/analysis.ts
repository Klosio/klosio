export namespace Analysis {
    export const MIN_WORDS = 2
    export const EMBEDDING_MODEL = "text-embedding-ada-002"
    export const LANGUAGE_MODEL = "gpt-3.5-turbo"
    export const PROMPT = `
    "Help a salesperson in the $industry$ industry selling $selling$ to $target$ answer to a problem expressed by a client using the possible answers provided.
    Here is the problem and possible answers:
    
    Problem:
    $question$
        
    Possible answers:
    $painpoints$
        
    Answer based only on the information provided. If there is not enough information in the problem expressed or you don't know what to answer, do not answer.
    Return your answer, as well as the problem rephrased as a simple question in a JSON format using the keys 'question' and 'answer'.
        
    If you haven't answered the question return an empty response."
    `
}
