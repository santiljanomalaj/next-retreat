const generatePostgresUpsertQuery = ({
    table,
    columns,
    values,
    conflictUniqueKey,
    valueNamesToUpdate,
  }) => `
      INSERT INTO ${table}
      (${columns.map((column) => column).join(', ')})
      VALUES
      (${values.map((value) => value).join(', ')})
      ON CONFLICT (${conflictUniqueKey})
      DO UPDATE SET ${valueNamesToUpdate
        .map((name) => `${name} = EXCLUDED.${name}`)
        .join(', ')}
    `

    const replaceStringsForSql = (string) => {
        // e.g.: "42\" flat screen TV with Internet and nintendo 64"
        const ESCAPED_QUOTE= "\"" // prettier-ignore
        // e.g. "Stingray's Sports Bar"
        const SINGLE_APOSTROPHE = /'/g
        return string.replace(ESCAPED_QUOTE, '""').replace(SINGLE_APOSTROPHE, "''")
      }

    module.exports = {
        generatePostgresUpsertQuery,
        replaceStringsForSql
    }