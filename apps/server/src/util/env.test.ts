import getEnvVar from "./env"

describe("Environnement getter util", () => {
    it("should return the value of the env var", () => {
        process.env["TEST"] = "test"
        expect(getEnvVar("TEST")).toEqual("test")
    })

    it("should throw an error when the variable is not defined", () => {
        expect(() => getEnvVar("MISSING_VAR")).toThrowError(
            "Missing env var: MISSING_VAR"
        )
    })
})
