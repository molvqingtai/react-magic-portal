import { useState } from 'react'
import MagicPortal from 'react-magic-portal'
import PortalContent from './components/portal-content'
import './App.css'

function App() {
  const [showAnchor, setShowAnchor] = useState(true)

  const handleMount = (anchor: Element, container: Element) => {
    console.log('Portal mounted:', { anchor, container })
  }

  const handleUnmount = (anchor: Element, container: Element) => {
    console.log('Portal unmounted:', { anchor, container })
  }

  return (
    <div className="app">
      <h1>MagicPortal Example</h1>

      <h2>Example</h2>
      <div className="portal-preview">
        {showAnchor && (
          <div className="dynamic-anchor" id="dynamic-anchor">
            Target Content
          </div>
        )}
      </div>
      <div className="controls">
        <button type="button" onClick={() => setShowAnchor(!showAnchor)}>
          {showAnchor ? 'Hide Anchor' : 'Show Anchor'}
        </button>
      </div>

      {/* Target anchor examples */}
      <MagicPortal anchor="#dynamic-anchor" position="before" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="before" />
      </MagicPortal>

      <MagicPortal anchor="#dynamic-anchor" position="first" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="first" />
      </MagicPortal>

      <MagicPortal anchor="#dynamic-anchor" position="last" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="last" />
      </MagicPortal>

      <MagicPortal anchor="#dynamic-anchor" position="after" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="after" />
      </MagicPortal>

      <h2>Instructions</h2>
      <div className="instructions">
        <ul>
          <li>
            <strong>last</strong>: Adds content inside the anchor element at the end
          </li>
          <li>
            <strong>first</strong>: Adds content inside the anchor element at the beginning
          </li>
          <li>
            <strong>before</strong>: Adds content as a sibling before the target anchor
          </li>
          <li>
            <strong>after</strong>: Adds content as a sibling after the target anchor
          </li>
        </ul>

        <p>
          <strong>💡 Key Feature:</strong> Notice how MagicPortal automatically detects when the target anchor appears
          or disappears. When you toggle the anchor visibility, the portal content automatically mounts and unmounts
          without any manual intervention.
        </p>

        <p>
          Open the browser console to see mount/unmount events. Try toggling the target anchor visibility to see how
          MagicPortal responds to DOM changes in real-time.
        </p>
      </div>
    </div>
  )
}

export default App
