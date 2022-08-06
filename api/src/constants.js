const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const CONTINENTS = [
  'Asia',
  'Europe',
  'Africa',
  'North America',
  'South America',
  'Antarctica',
  'Oceania',
  'Australia',
]

const DESTINATION_TYPES = ['MOUNTAINS', 'BEACH', 'CITY']

const DESTINATION_SORTER_TYPES = {
  OPTIMAL: 'OPTIMAL',
  TRAVEL_TIME: 'TRAVEL_TIME',
  PRICE: 'PRICE',
}

const BASE_CURRENCY_ISO_CODE = 'EUR'

const DEFAULT_PRICELINE_FORMAT = 'json2'
const COMMON_PRICELINE_API_PARAMS = {
  api_key: process.env.PRICELINE_API_KEY,
  refid: process.env.PRICELINE_REF_ID,
  format: DEFAULT_PRICELINE_FORMAT,
  field_blacklist: 'csv'
}

const SENDGRID_EMAIL_TEMPLATE_IDS = {
  NEW_DESTINATION_REQUEST: 'd-09b06cdb590f4f92a2fb7c8d29e96e03',
  CONTACT_US: 'd-ac4bb2fa96eb4180bb577dc83bd837e4',
  NEW_BOOKING_REQUEST: 'd-f65ef235f9e34ae3b089dd6ce5c7f13b',
  REQUEST_ACCESS: 'd-f6c7f64023bc4c03901681a8243af4d9',
  REQUEST_LOGIN_LINK: 'd-7484824bdf1441fbbe993df079526bdd',
  CHECK_AVAILABILITY_FORM: 'd-87b30e9f3a0643e49bc6b431fe1cf26e',
  ASK_A_QUESTION_FORM: 'd-da2d23603647493cb2616571c36b30b8',
  REQUEST_RECEIVED_CONFIRMATION: 'd-d16a198967a744a1997a862590c94804',
  WELCOME_BACK_MAGIC_LINK: 'd-4b57a7eab82243728d0092a29dba8391',
}

const ADDITIONAL_SERVICES = {
  WIFI: 'WIFI',
  INSURANCE: 'INSURANCE',
  ACTIVITIES: 'ACTIVITIES',
  TRANSPORTATION: 'TRANSPORTATION',
  FOOD: 'FOOD',
  OTHER: 'OTHER',
}

const NEXT_RETREAT_SUPPORT_EMAIL = 'support@nextretreat.com'

module.exports = {
  MONTHS,
  CONTINENTS,
  DESTINATION_TYPES,
  DESTINATION_SORTER_TYPES,
  BASE_CURRENCY_ISO_CODE,
  COMMON_PRICELINE_API_PARAMS,
  SENDGRID_EMAIL_TEMPLATE_IDS,
  ADDITIONAL_SERVICES,
  NEXT_RETREAT_SUPPORT_EMAIL
}
