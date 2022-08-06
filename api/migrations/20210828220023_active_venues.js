exports.up = async (knex) => {
    await knex.schema.raw(`
    ALTER TABLE venues ADD COLUMN venue_type_n INT;
    ALTER TABLE venues ADD COLUMN is_entire_house BOOLEAN;

    UPDATE venues SET venue_type_n = 101 WHERE hotel_type = 'Apartment';
    UPDATE venues SET venue_type_n = 102 WHERE hotel_type = 'Apartments';
    UPDATE venues SET venue_type_n = 201 WHERE hotel_type = 'Motel';
    UPDATE venues SET venue_type_n = 202 WHERE hotel_type = 'Aparthotels';
    UPDATE venues SET venue_type_n = 203 WHERE hotel_type = 'Hostel';
    UPDATE venues SET venue_type_n = 203 WHERE hotel_type = 'Resorts';
    UPDATE venues SET venue_type_n = 204 WHERE hotel_type = 'Hotels';
    UPDATE venues SET venue_type_n = 205 WHERE hotel_type = 'Hostels';
    UPDATE venues SET venue_type_n = 206 WHERE hotel_type = 'Resort';
    UPDATE venues SET venue_type_n = 207 WHERE hotel_type = 'Hotel';
    UPDATE venues SET venue_type_n = 301 WHERE hotel_type = 'Farm stays';
    UPDATE venues SET venue_type_n = 302 WHERE hotel_type = 'Inns';
    UPDATE venues SET venue_type_n = 303 WHERE hotel_type = 'Villas';
    UPDATE venues SET venue_type_n = 304 WHERE hotel_type = 'Luxury tents';
    UPDATE venues SET venue_type_n = 305 WHERE hotel_type = 'Campsites';
    UPDATE venues SET venue_type_n = 306 WHERE hotel_type = 'Other';
    UPDATE venues SET venue_type_n = 307 WHERE hotel_type = 'Guest accommodation';
    UPDATE venues SET venue_type_n = 308 WHERE hotel_type = 'Holiday homes';
    UPDATE venues SET venue_type_n = 309 WHERE hotel_type = 'Lodges';
    UPDATE venues SET venue_type_n = 310 WHERE hotel_type = 'Boats';
    UPDATE venues SET venue_type_n = 311 WHERE hotel_type = 'Holiday parks';
    UPDATE venues SET venue_type_n = 312 WHERE hotel_type = 'Bed and breakfasts';
    UPDATE venues SET venue_type_n = 313 WHERE hotel_type = 'Chalets';
    UPDATE venues SET venue_type_n = 314 WHERE hotel_type = 'Homestays';
    UPDATE venues SET venue_type_n = 315 WHERE hotel_type = 'Country houses';
    UPDATE venues SET venue_type_n = 316 WHERE hotel_type = 'Guest houses';
    UPDATE venues SET venue_type_n = 317 WHERE hotel_type = 'Residence';
    UPDATE venues SET venue_type_n = 318 WHERE hotel_type = 'Bed and Breakfast';
    UPDATE venues SET venue_type_n = 319 WHERE hotel_type = 'Student Accommodation';
    UPDATE venues SET is_entire_house = TRUE where room_count = 1;


    CREATE MATERIALIZED VIEW active_venues AS 
    SELECT 
    id,
destination_id,
cityid_ppn,
city,
hotelid_ppn,
hotel_type,
hotel_name,
hotel_address,
lat,
lon,
country,
country_code,
star_rating,
low_rate,
currency_code,
review_rating,
review_count,
rank_score_ppn,
thumbnail,
room_count,
check_in,
check_out,
property_description,
is_meeting_room_included,
is_promoted,
source,
capacity,
venue_type_n,
is_entire_house
FROM venues WHERE "is_active" = TRUE and 
    ("is_quality" = TRUE or "is_manual_quality" = TRUE) and "review_rating" is not null order by destination_id;
    CREATE UNIQUE INDEX active_venues_id ON active_venues (id);
    CREATE INDEX active_venues_destination_id_index ON active_venues (destination_id);
  `)
}

exports.down = async (knex) => {
    await knex.schema.raw(`
    DROP MATERIALIZED VIEW active_venues;
    ALTER TABLE venues DROP COLUMN venue_type_n;
    ALTER TABLE venues DROP COLUMN is_entire_house;
    `)
}