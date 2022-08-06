import React from 'react'
import { ToastContainer, Slide } from 'react-toastify'
import styled from 'styled-components'
import { fontStack, COLORS, space, radius } from 'Theme'
import 'react-toastify/dist/ReactToastify.min.css'

const StyledContainer = styled(ToastContainer)`
  .Toastify__toast-container {
    margin-bottom: ${space.m};
  }
  .Toastify__toast {
    box-shadow: 0px 2px 8px rgba(66, 149, 165, 0.2),
      0px 2px 2px rgba(66, 149, 165, 0.25),
      0px -2px 2px rgba(66, 149, 165, 0.25);
    border-radius: ${radius.m};
    font-family: ${fontStack};
    padding: ${space.m} ${space.m};
    color: ${COLORS.SPACE_CADET};
  }
  .Toastify__toast--error {
    color: ${COLORS.WHITE};
    background: ${COLORS.SPARKLING_RED};
  }
  .Toastify__toast--info {
    color: ${COLORS.WHITE};
    background: ${COLORS.CHUN_LI_BLUE};
  }
  .Toastify__toast--success {
    color: ${COLORS.WHITE};
    background: ${COLORS.EXPLORATION_GREEN};
  }
`

const Container = () => (
  <StyledContainer
    position="bottom-left"
    autoClose={3000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnVisibilityChange
    pauseOnHover
    transition={Slide}
    closeButton={false}
  />
)

export default Container
