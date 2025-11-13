import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval('Clear old users', { hours: 1 }, internal.username.clear)

export default crons
