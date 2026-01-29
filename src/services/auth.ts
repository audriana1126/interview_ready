export type User = {
    id: string;
    name: string;
    email: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

const FAKE_USER: User = {
    id: "1",
    name: "Audri",
    email:"audri@example.com",
};


export async function login(input: LoginInput): Promise<User> {
    await new Promise((r) => setTimeout(r, 600));

    if (input.email.toLowerCase() === FAKE_USER.email && input.password.length >= 6) {
        return FAKE_USER;
    }

    throw new Error("Invalid email or password.");
}
