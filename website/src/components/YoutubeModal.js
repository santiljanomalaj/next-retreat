import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mq, space } from 'Theme'
import Modal, { useModal } from 'components/Modal'

const VideoWrapper = styled('div')`
  position: relative;

  &:before {
    content: '';

    display: block;

    width: calc(100vw - ${space.xl});
    padding-top: calc(9 / 16 * 100%);

    ${mq.from.tablet`
      width: calc(100vw - ${space.xxl});
    `}

    ${mq.from.desktop`
      width: calc(100vw - ${space.xxxl});
    `}
  }
`

const Video = styled('iframe')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  max-width: 100%;
  width: 100%;
  height: 100%;
`

const YoutubeModal = ({ youtubeVideoId, setYoutubeVideoId }) => {
  const { isOpen, openModal, closeModal } = useModal()
  const memoizedOpenModal = React.useCallback(openModal, [])

  React.useEffect(() => {
    if (youtubeVideoId) {
      memoizedOpenModal()
    }
  }, [youtubeVideoId, memoizedOpenModal])

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => {
        setYoutubeVideoId('')
        closeModal()
      }}
      ariaLabel="Youtube video modal"
    >
      <VideoWrapper>
        <Video
          title="Youtube video player"
          id="ytplayer"
          type="text/html"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
          frameBorder="0"
        />
      </VideoWrapper>
    </Modal>
  )
}

YoutubeModal.propTypes = {
  youtubeVideoId: PropTypes.string.isRequired,
  setYoutubeVideoId: PropTypes.func.isRequired,
}

export default YoutubeModal
