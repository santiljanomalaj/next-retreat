export const createStoryName = ({ base, filename }) => {
  const trimmedBase = base.replace(/^\/+|\/+$/g, '') // trim leading and/or trailing slashes
  return `${trimmedBase.replace('src/components/', '')}/${filename.replace(
    '.stories',
    ''
  )}`
}
