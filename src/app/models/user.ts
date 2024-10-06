export class User {
    constructor(
        public firstName: string,
        public lastName: string,
        public phone: string,
        public email: string
      ) {}
}

export class Credentials {
    constructor(
        public username: string,
        public password: string
    ) {}
}