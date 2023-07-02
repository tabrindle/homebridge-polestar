export function periodic(fn: () => any, log: any) {
  const minDelay = 5 * 60 * 1000 // 5 minutes in milliseconds
  const maxDelay = 10 * 60 * 1000 // 10 minutes in milliseconds

  function runTask() {
    log.debug("Running periodic task...")
    fn()
  }

  function scheduleNextRun() {
    log.debug("Scheduling next periodic task...")
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
    setTimeout(() => {
      runTask()
      scheduleNextRun()
    }, delay)
  }

  scheduleNextRun()
}
