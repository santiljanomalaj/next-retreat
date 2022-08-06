exports.up = async (knex) => {
    await knex.schema.raw(`
        UPDATE venues
        SET thumbnail = TN.thumbnail
        FROM
            (SELECT *
                FROM
                    (SELECT ID,
                            'https://mobileimg.pclncdn.com/htlimg/master/' || SUBSTRING(HOTELID_T::text,0,LENGTH(HOTELID_T::text) - 4) 
                            || '/' || SUBSTRING(HOTELID_T::text,LENGTH(HOTELID_T::text) - 4,1) 
                            || '/' || SUBSTRING(HOTELID_T::text,LENGTH(HOTELID_T::text) - 3,1) 
                            || '/' || HOTELID_T::text || '/master_' || HOTELID_T::text AS thumbnail
                        FROM VENUES) AS S
                WHERE S.THUMBNAIL IS NOT NULL ) AS TN
        WHERE venues.id = TN.id;

        REFRESH MATERIALIZED VIEW CONCURRENTLY ACTIVE_VENUES;`
    )
}

exports.down = async (knex) => {}