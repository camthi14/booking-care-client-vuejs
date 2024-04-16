import { faker } from "@faker-js/faker";

const users = [...Array(50)].map((_, index) => ({
  user_id: faker.datatype.number({ min: 1, max: 51 }),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  password: faker.internet.password(),
  phone: faker.phone.number(),
  gender: new Date().getTime() % 2 === 0 ? "male" : "female",
  birth_year: faker.date.birthdate().toDateString(),
  role_id:
    new Date().getTime() % 3 === 0
      ? "ADMIN"
      : new Date().getTime() % 2 === 0
      ? "DOCTOR"
      : "USER",
  specialty_id: new Date().getTime() % 2 === 0 ? "S1" : "S2",
  position_id: new Date().getTime() % 2 === 0 ? "Doctor" : "Master",
  clinic: faker.name.jobArea(),
}));

// R1: Admin
// R2: doctors
// R3: user

export default users;
