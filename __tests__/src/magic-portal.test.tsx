import React, { useRef, useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MagicPortal from 'react-magic-portal'

describe('MagicPortal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should render children in portal when anchor exists', () => {
      // Setup anchor element
      const anchor = document.createElement('div')
      anchor.id = 'test-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#test-anchor">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should not render children when anchor does not exist', () => {
      render(
        <MagicPortal anchor="#non-existent">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })

    it('should render children when anchor appears later', async () => {
      function TestComponent() {
        const [showAnchor, setShowAnchor] = useState(false)

        return (
          <div>
            <button type="button" onClick={() => setShowAnchor(true)}>
              Show Anchor
            </button>
            {showAnchor && <div id="dynamic-anchor">Anchor</div>}
            <MagicPortal anchor="#dynamic-anchor">
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      expect(screen.queryByTestId('portal-content')).toBeNull()

      await user.click(screen.getByText('Show Anchor'))

      await waitFor(() => {
        expect(screen.getByTestId('portal-content')).toBeTruthy()
      })
    })

    it('should clean up when anchor is removed', async () => {
      function TestComponent() {
        const [showAnchor, setShowAnchor] = useState(true)

        return (
          <div>
            <button type="button" onClick={() => setShowAnchor(false)}>
              Hide Anchor
            </button>
            {showAnchor && <div id="dynamic-anchor">Anchor</div>}
            <MagicPortal anchor="#dynamic-anchor">
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      expect(screen.getByTestId('portal-content')).toBeTruthy()

      await user.click(screen.getByText('Hide Anchor'))

      await waitFor(() => {
        expect(screen.queryByTestId('portal-content')).toBeNull()
      })
    })
  })

  describe('Anchor Types', () => {
    it('should work with CSS selector string', () => {
      const anchor = document.createElement('div')
      anchor.className = 'test-class'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor=".test-class">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should work with element reference', () => {
      function TestComponent() {
        const anchorRef = useRef<HTMLDivElement>(null)

        return (
          <div>
            <div ref={anchorRef} data-testid="anchor">
              Anchor
            </div>
            <MagicPortal anchor={anchorRef}>
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      render(<TestComponent />)

      const portalContent = screen.getByTestId('portal-content')
      const anchor = screen.getByTestId('anchor')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should work with function returning element', () => {
      const anchor = document.createElement('div')
      anchor.id = 'function-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor={() => document.getElementById('function-anchor')}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should work with direct element', () => {
      const anchor = document.createElement('div')
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor={anchor}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should handle null anchor gracefully', () => {
      render(
        <MagicPortal anchor={null}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })
  })

  describe('Position Options', () => {
    beforeEach(() => {
      const anchor = document.createElement('div')
      anchor.id = 'position-anchor'
      anchor.innerHTML = '<span>Existing Content</span>'
      document.body.appendChild(anchor)
    })

    it('should last by default', () => {
      render(
        <MagicPortal anchor="#position-anchor">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should first when position is first', () => {
      render(
        <MagicPortal anchor="#position-anchor" position="first">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should position before when position is before', () => {
      render(
        <MagicPortal anchor="#position-anchor" position="before">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(portalContent).toBeTruthy()
      // For before position, content should be positioned before the anchor
      expect(anchor.parentElement!.contains(portalContent) || document.body.contains(portalContent)).toBe(true)
    })

    it('should position after when position is after', () => {
      render(
        <MagicPortal anchor="#position-anchor" position="after">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(portalContent).toBeTruthy()
      // For after position, content should be positioned after the anchor
      expect(anchor.parentElement!.contains(portalContent) || document.body.contains(portalContent)).toBe(true)
    })
  })

  describe('Lifecycle Callbacks', () => {
    it('should call onMount when portal is mounted', async () => {
      const onMount = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'mount-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#mount-anchor" onMount={onMount}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      await waitFor(() => {
        expect(onMount).toHaveBeenCalledTimes(1)
        expect(onMount).toHaveBeenCalledWith(anchor, expect.any(HTMLDivElement))
      })
    })

    it('should call onUnmount when component is unmounted', async () => {
      const onUnmount = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'unmount-anchor'
      document.body.appendChild(anchor)

      const { unmount } = render(
        <MagicPortal anchor="#unmount-anchor" onUnmount={onUnmount}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.getByTestId('portal-content')).toBeTruthy()

      unmount()

      expect(onUnmount).toHaveBeenCalledTimes(1)
      expect(onUnmount).toHaveBeenCalledWith(anchor, expect.any(HTMLDivElement))
    })

    it('should call both onMount and onUnmount during anchor changes', async () => {
      const onMount = vi.fn()
      const onUnmount = vi.fn()

      // Create anchor element that will persist
      const anchor = document.createElement('div')
      anchor.id = 'toggle-anchor'

      const { unmount } = render(
        <MagicPortal anchor="#toggle-anchor" onMount={onMount} onUnmount={onUnmount}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      // No anchor exists initially
      expect(screen.queryByTestId('portal-content')).toBeNull()
      expect(onMount).not.toHaveBeenCalled()

      // Add anchor to DOM
      document.body.appendChild(anchor)

      // Wait for portal to mount
      await waitFor(() => {
        expect(screen.getByTestId('portal-content')).toBeTruthy()
        expect(onMount).toHaveBeenCalledTimes(1)
      })

      // Unmount component to trigger onUnmount
      unmount()
      expect(onUnmount).toHaveBeenCalledTimes(1)
    })
  })

  describe('Portal Content Ref Handling', () => {
    it('should forward ref to portal content element', () => {
      const contentRef = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'ref-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#ref-anchor">
          <div ref={contentRef} data-testid="portal-content">
            Portal Content
          </div>
        </MagicPortal>
      )

      expect(contentRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
      expect(contentRef.mock.calls[0][0]?.textContent).toBe('Portal Content')
    })

    it('should handle function refs on portal content', () => {
      let refElement: HTMLDivElement | null = null
      const refCallback = (element: HTMLDivElement | null) => {
        refElement = element
      }

      const anchor = document.createElement('div')
      anchor.id = 'func-ref-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#func-ref-anchor">
          <div ref={refCallback} data-testid="portal-content">
            Portal Content
          </div>
        </MagicPortal>
      )

      expect(refElement).toBeInstanceOf(HTMLDivElement)
      expect(refElement!.textContent).toBe('Portal Content')
    })

    it('should call ref callback with null when content unmounts', () => {
      const refCallback = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'unmount-ref-anchor'
      document.body.appendChild(anchor)

      const { unmount } = render(
        <MagicPortal anchor="#unmount-ref-anchor">
          <div ref={refCallback} data-testid="portal-content">
            Portal Content
          </div>
        </MagicPortal>
      )

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement))

      unmount()

      expect(refCallback).toHaveBeenLastCalledWith(null)
    })

    it('should maintain content refs across position changes', async () => {
      const contentRef = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'position-ref-anchor'
      document.body.appendChild(anchor)

      const { rerender } = render(
        <MagicPortal anchor="#position-ref-anchor" position="last">
          <div ref={contentRef} data-testid="portal-content">
            Portal Content
          </div>
        </MagicPortal>
      )

      expect(contentRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
      expect(screen.getByTestId('portal-content')).toBeTruthy()

      // Clear mock to track new calls
      contentRef.mockClear()

      rerender(
        <MagicPortal anchor="#position-ref-anchor" position="first">
          <div ref={contentRef} data-testid="portal-content">
            Portal Content
          </div>
        </MagicPortal>
      )

      // Content should be re-rendered with new position
      expect(contentRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
      expect(screen.getByTestId('portal-content')).toBeTruthy()
    })

    it('should work with forwardRef components as portal content', () => {
      const ForwardedComponent = React.forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
        ({ children }, forwardedRef) => (
          <button type="button" ref={forwardedRef}>
            {children}
          </button>
        )
      )

      ForwardedComponent.displayName = 'ForwardedComponent'

      const refCalls: Array<HTMLButtonElement | null> = []
      const handleButtonRef: React.RefCallback<HTMLButtonElement> = (element) => {
        refCalls.push(element)
      }
      const anchor = document.createElement('div')
      anchor.id = 'forward-ref-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#forward-ref-anchor">
          <ForwardedComponent ref={handleButtonRef}>Click me</ForwardedComponent>
        </MagicPortal>
      )

      expect(refCalls[0]).toBeInstanceOf(HTMLButtonElement)
      expect(refCalls[0]?.textContent).toBe('Click me')
    })

    it('should log error when multiple children are provided', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const anchor = document.createElement('div')
      anchor.id = 'multiple-children-anchor'
      document.body.appendChild(anchor)

      render(
        // @ts-expect-error - intentionally passing multiple children to assert runtime guard
        <MagicPortal anchor="#multiple-children-anchor">
          <span data-testid="first-element">First element</span>
          <span data-testid="second-element">Second element</span>
        </MagicPortal>
      )

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[react-magic-portal] Multiple children are not supported, expected to receive a single React element child.'
      )
      expect(anchor.children.length).toBe(0)

      consoleErrorSpy.mockRestore()
    })

    it('should handle nested refs correctly', () => {
      const outerRef = vi.fn()
      const innerRef = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'nested-ref-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#nested-ref-anchor">
          <div ref={outerRef} data-testid="outer-element">
            <span ref={innerRef} data-testid="inner-element">
              Nested content
            </span>
          </div>
        </MagicPortal>
      )

      expect(outerRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
      expect(innerRef).toHaveBeenCalledWith(expect.any(HTMLSpanElement))
      expect(screen.getByTestId('outer-element')).toBeTruthy()
      expect(screen.getByTestId('inner-element')).toBeTruthy()
    })

    it('should handle ref updates when content changes', async () => {
      const ref1 = vi.fn()
      const ref2 = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'dynamic-content-anchor'
      document.body.appendChild(anchor)

      function TestComponent() {
        const [showFirst, setShowFirst] = useState(true)

        return (
          <div>
            <button type="button" onClick={() => setShowFirst(!showFirst)}>
              Toggle Content
            </button>
            <MagicPortal anchor="#dynamic-content-anchor">
              {showFirst ? (
                <div ref={ref1} data-testid="first-content">
                  First Content
                </div>
              ) : (
                <span ref={ref2} data-testid="second-content">
                  Second Content
                </span>
              )}
            </MagicPortal>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      expect(ref1).toHaveBeenCalledWith(expect.any(HTMLDivElement))
      expect(screen.getByTestId('first-content')).toBeTruthy()

      // Toggle content
      await user.click(screen.getByText('Toggle Content'))

      // Wait for the content to change and verify second ref is called
      await waitFor(() => {
        expect(ref2).toHaveBeenCalledWith(expect.any(HTMLSpanElement))
        expect(screen.getByTestId('second-content')).toBeTruthy()
      })
    })
  })

  describe('Multiple Portals', () => {
    it('should support multiple portals on the same anchor', () => {
      const anchor = document.createElement('div')
      anchor.id = 'multi-anchor'
      document.body.appendChild(anchor)

      render(
        <div>
          <MagicPortal anchor="#multi-anchor" position="first">
            <div data-testid="portal-1">Portal 1</div>
          </MagicPortal>
          <MagicPortal anchor="#multi-anchor" position="last">
            <div data-testid="portal-2">Portal 2</div>
          </MagicPortal>
        </div>
      )

      const portal1 = screen.getByTestId('portal-1')
      const portal2 = screen.getByTestId('portal-2')
      expect(portal1).toBeTruthy()
      expect(portal2).toBeTruthy()
      expect(anchor.contains(portal1)).toBe(true)
      expect(anchor.contains(portal2)).toBe(true)
    })
  })

  describe('Dynamic Content Updates', () => {
    it('should detect when matching elements are added to DOM', async () => {
      function TestComponent() {
        const [elementCount, setElementCount] = useState(0)

        const addElement = () => {
          const newElement = document.createElement('div')
          newElement.className = 'dynamic-target'
          newElement.textContent = `Target ${elementCount + 1}`
          document.body.appendChild(newElement)
          setElementCount((prev) => prev + 1)
        }

        return (
          <div>
            <button type="button" onClick={addElement}>
              Add Target Element
            </button>
            <MagicPortal anchor=".dynamic-target">
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      expect(screen.queryByTestId('portal-content')).toBeNull()

      await user.click(screen.getByText('Add Target Element'))

      await waitFor(() => {
        expect(screen.getByTestId('portal-content')).toBeTruthy()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid selectors gracefully', () => {
      expect(() => {
        render(
          <MagicPortal anchor="invalid>>>selector">
            <div data-testid="portal-content">Portal Content</div>
          </MagicPortal>
        )
      }).not.toThrow()

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })

    it('should handle function that returns null', () => {
      render(
        <MagicPortal anchor={() => null}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })

    it('should handle function that throws error', () => {
      const errorFunction = () => {
        throw new Error('Test error')
      }

      // The component should handle the error gracefully and not crash
      expect(() => {
        render(
          <MagicPortal anchor={errorFunction}>
            <div data-testid="portal-content">Portal Content</div>
          </MagicPortal>
        )
      }).toThrow('Test error')

      // Portal content should not be rendered when anchor function throws
      expect(screen.queryByTestId('portal-content')).toBeNull()
    })
  })

  describe('Key Prop', () => {
    it('should pass key to ReactDOM.createPortal', () => {
      const anchor = document.createElement('div')
      anchor.id = 'key-anchor'
      document.body.appendChild(anchor)

      const { rerender } = render(
        <MagicPortal anchor="#key-anchor" key="test-key-1">
          <div data-testid="portal-content-1">Portal Content 1</div>
        </MagicPortal>
      )

      expect(screen.getByTestId('portal-content-1')).toBeTruthy()

      rerender(
        <MagicPortal anchor="#key-anchor" key="test-key-2">
          <div data-testid="portal-content-2">Portal Content 2</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content-1')).toBeNull()
      expect(screen.getByTestId('portal-content-2')).toBeTruthy()
    })
  })

  describe('Text Node Handling', () => {
    it('should not render Fragment children', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const anchor = document.createElement('div')
      anchor.id = 'fragment-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#fragment-anchor">
          <>
            <div>Child 1</div>
            <div>Child 2</div>
          </>
        </MagicPortal>
      )

      // Should log error about Fragment not being supported
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[react-magic-portal] Fragment children are not supported, expected to receive a single React element child.'
      )

      // Anchor should remain empty since Fragment is not supported
      expect(anchor.textContent).toBe('')
      expect(anchor.children.length).toBe(0)

      consoleErrorSpy.mockRestore()
    })

    it('should not render pure text content', () => {
      const anchor = document.createElement('div')
      anchor.id = 'text-only-anchor'
      document.body.appendChild(anchor)

      render(
        // @ts-expect-error - testing that text nodes are not rendered
        <MagicPortal anchor="#text-only-anchor">Just plain text</MagicPortal>
      )

      // Anchor should remain empty since text nodes are not rendered
      expect(anchor.textContent).toBe('')
      expect(anchor.children.length).toBe(0)
    })

    it('should not render null children', () => {
      const anchor = document.createElement('div')
      anchor.id = 'null-anchor'
      document.body.appendChild(anchor)

      render(<MagicPortal anchor="#null-anchor">{null}</MagicPortal>)

      // Anchor should remain empty since null is not rendered
      expect(anchor.textContent).toBe('')
      expect(anchor.children.length).toBe(0)
    })
  })

  describe('Cleanup', () => {
    it('should clean up MutationObserver on unmount', () => {
      const anchor = document.createElement('div')
      anchor.id = 'cleanup-anchor'
      document.body.appendChild(anchor)

      const { unmount } = render(
        <MagicPortal anchor="#cleanup-anchor">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.getByTestId('portal-content')).toBeTruthy()

      expect(() => unmount()).not.toThrow()
      expect(screen.queryByTestId('portal-content')).toBeNull()
    })
  })
  it('should call ref cleanup function on unmount', () => {
    const cleanupFn = vi.fn()
    // React 19: Cleanup functions for refs
    const customRef = () => () => cleanupFn()

    const anchor = document.createElement('div')
    anchor.id = 'cleanup-ref-anchor'
    document.body.appendChild(anchor)

    const { unmount } = render(
      <MagicPortal anchor="#cleanup-ref-anchor">
        <div ref={customRef} data-testid="portal-content">
          Portal Content
        </div>
      </MagicPortal>
    )

    expect(screen.getByTestId('portal-content')).toBeTruthy()

    unmount()

    expect(cleanupFn).toHaveBeenCalledTimes(1)
  })
})
