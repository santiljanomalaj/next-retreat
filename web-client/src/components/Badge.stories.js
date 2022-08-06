import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import Badge from './Badge'

export const DefaultBadge = () => <Badge>HOTEL</Badge>

export const Filled = () => <Badge.Filled>4 OF 5 TEAMS OK</Badge.Filled>

export const Success = () => (
  <Badge.Success>WORKS FOR ALL TEAM MEMBERS!</Badge.Success>
)

export default {
  component: Badge,
  title: createStoryName({ base, filename }),
}
