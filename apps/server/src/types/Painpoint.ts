interface Painpoint {
    painpoint: string
    answer: string
}

interface EmbeddedPainpoint extends Painpoint {
    organization_id: string
    embedding: number[]
}

export type { Painpoint, EmbeddedPainpoint }
