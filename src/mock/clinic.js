import { faker } from "@faker-js/faker";

const createService = (clinic_id) => ({
  service_id: faker.datatype.uuid(),
  name: faker.address.county(),
  price: faker.datatype.number({ min: 100000, max: 3000000 }),
  desc: faker.random.words(20),
  clinic_id: clinic_id,
});

const clinics = [...Array(50)].map((_, index) => {
  const id = faker.datatype.uuid();

  return {
    clinic_id: id,
    address: faker.address.county(),
    desc: faker.random.words(20),
    image: faker.image.city(),
    name: faker.name.jobArea(),
    services: [...Array(new Date().getTime() % 2 === 0 ? 2 : 3)].map(
      (_, index) => createService(id)
    ),
  };
});

const services = [...Array(50)].map((_, index) =>
  createService(faker.datatype.uuid())
);

export default clinics;
