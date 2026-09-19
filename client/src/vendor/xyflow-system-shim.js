// @xyflow/react@12.11.4 imports handleAttributionWarning, but its pinned
// @xyflow/system@0.0.80 package does not export it. Re-export the real system
// package and provide the missing development-only attribution warning hook.
export * from '../../../node_modules/@xyflow/system/dist/esm/index.js'

let attributionWarningShown = false

export function handleAttributionWarning(library) {
  if (attributionWarningShown) {
    return
  }

  attributionWarningShown = true
  console.warn(
    `[${library}] Please only hide the attribution when you are subscribed to React Flow Pro: https://reactflow.dev/remove-attribution`
  )
}
