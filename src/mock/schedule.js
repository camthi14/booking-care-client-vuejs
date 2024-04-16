import { faker } from "@faker-js/faker";
import users from "./user";
import { createWork } from "./works";

const doctors = users.filter((i) => i.role_id === "R2");

const works = [...Array(10)]
  .map((_, index) => createWork(index + 1))
  .sort((a, b) => a.work_id - b.work_id);

const schedules = [...Array(doctors.length)].map((_, index) => {
  return {
    works,
    user_id: doctors[index].user_id,
    date_time: faker.datatype.datetime(),
  };
});

export default schedules;
