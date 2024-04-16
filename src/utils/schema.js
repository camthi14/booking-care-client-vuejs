import * as Yup from "yup";

const phoneRegExp = /(03|05|07|08|09|02|04|06|01[2|6|8|9])+([0-9]{7})\b/;

export const schemaFormAddDoctor = Yup.object().shape({
  email: Yup.string()
    .email("Vui lòng nhập e-mail hợp lệ!")
    .required("Đây là trường bắt buộc."),
  first_name: Yup.string()
    .min(2, "Ít nhất 2 ký tự.")
    .max(30, "Nhiều nhất 30 ký tự.")
    .required("Đây là trường bắt buộc."),
  last_name: Yup.string()
    .min(2, "Ít nhất 2 ký tự")
    .max(30, "Nhiều nhất 30 ký tự")
    .required("Đây là trường bắt buộc"),
  password: Yup.string()
    .min(4, "Ít nhất 4 ký tự")
    .max(80, "Nhiều nhất 80 ký tự")
    .required("Đây là trường bắt buộc"),
  phone: Yup.string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ.")
    .required("Số điện thoại là trường bắt buộc"),
  address: Yup.string()
    .min(2, "Ít nhất 2 ký tự")
    .max(300, "Nhiều nhất 300 ký tự")
    .required("Đây là trường bắt buộc"),
  content_title: Yup.string()
    .min(2, "Ít nhất 2 ký tự")
    .max(500, "Nhiều nhất 500 ký tự")
    .required("Đây là trường bắt buộc"),
});

export const schemaFormUpdateDoctor = Yup.object().shape({
  email: Yup.string()
    .email("Vui lòng nhập e-mail hợp lệ!")
    .required("Đây là trường bắt buộc."),
  first_name: Yup.string()
    .min(2, "Ít nhất 2 ký tự.")
    .max(30, "Nhiều nhất 30 ký tự.")
    .required("Đây là trường bắt buộc."),
  last_name: Yup.string()
    .min(2, "Ít nhất 2 ký tự")
    .max(30, "Nhiều nhất 30 ký tự")
    .required("Đây là trường bắt buộc"),
  phone: Yup.string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ.")
    .required("Số điện thoại là trường bắt buộc"),
  address: Yup.string()
    .min(2, "Ít nhất 2 ký tự")
    .max(500, "Nhiều nhất 500 ký tự")
    .required("Đây là trường bắt buộc"),
  content_title: Yup.string()
    .min(2, "Ít nhất 2 ký tự")
    .max(500, "Nhiều nhất 500 ký tự")
    .required("Đây là trường bắt buộc"),
});
