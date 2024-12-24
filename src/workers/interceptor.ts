interface CSPViolationData {
  blockedURI: string;
  violatedDirective: string;
  originalPolicy: string;
  disposition: string;
}

// const detectFailedConnections = () => {
//   // Store original methods to prevent recursion
//   const originalMethods = {
//     WebSocket: window.WebSocket,
//     fetch: window.fetch,
//     XMLHttpRequest: window.XMLHttpRequest,
//     EventSource: window.EventSource
//   };

//   // Utility function to get current timestamp
//   const getTimestamp = (): string => new Date().toISOString();

//   // Performance monitoring for resource loading failures
//   const performanceObserver = new PerformanceObserver((list) => {
//     list.getEntries().forEach((entry) => {
//       if (entry.entryType === 'resource') {
//         const resourceEntry = entry as PerformanceResourceTiming;
//         if ((resourceEntry as any).responseStatus >= 400 || resourceEntry.duration === 0) {
//           console.log('Resource loading failed:', {
//             url: resourceEntry.name,
//             initiatorType: resourceEntry.initiatorType,
//             duration: resourceEntry.duration,
//             timestamp: getTimestamp()
//           });
//         }
//       }
//     });
//   });

//   performanceObserver.observe({ entryTypes: ['resource'] });

//   // CSP violation monitoring
//   document.addEventListener('securitypolicyviolation', (event: SecurityPolicyViolationEvent) => {
//     const violationData: CSPViolationData = {
//       blockedURI: event.blockedURI,
//       violatedDirective: event.violatedDirective,
//       originalPolicy: event.originalPolicy,
//       disposition: event.disposition,
//       timestamp: getTimestamp()
//     };
//     console.log('CSP Violation:', violationData);
//   });

//   // CORS error detection utility
//   const isCORSError = (error: Error): boolean => {
//     return error.name === 'TypeError' &&
//       (error.message.includes('CORS') ||
//         error.message.includes('Cross-Origin'));
//   };
// };

function traceRequests() {
  const log = (msg: string, data?: any) => {
    console.log(`[Interceptor] ${msg}`, data || '');
  };

  // Store original methods before any potential modifications
  const originals = {
    createElement: Document.prototype.createElement,
    appendChild: Node.prototype.appendChild,
    insertBefore: Node.prototype.insertBefore,
    WebSocket: window.WebSocket,
    // biome-ignore lint/security/noGlobalEval: <explanation>
    eval: window.eval,
    Function: window.Function,
  };

  // Track script execution order
  const executionStack: string[] = [];

  // Intercept script creation and execution
  //@ts-ignore
  Document.prototype.createElement = function (tagName: string, options?: ElementCreationOptions): Element {
    const element = originals.createElement.call(this, tagName, options);

    if (tagName.toLowerCase() === 'script') {
      const scriptElement = element as HTMLScriptElement;
      const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');

      // Monitor script source changes
      Object.defineProperty(scriptElement, 'src', {
        set(value) {
          log('Script src being set', { value });
          if (originalSrcDescriptor?.set) {
            originalSrcDescriptor.set.call(this, value);
          }
        },
        get() {
          return originalSrcDescriptor?.get ? originalSrcDescriptor.get.call(this) : '';
        }
      });
    }

    return element;
  };

  // Intercept script injection
  Node.prototype.appendChild = function <T extends Node>(node: T): T {
    if (node instanceof HTMLScriptElement) {
      log('Script being appended', { src: node.src });
      executionStack.push(node.src || 'inline-script');
    }
    return originals.appendChild.call(this, node) as T;
  };

  Node.prototype.insertBefore = function <T extends Node>(node: T, reference: Node | null): T {
    if (node instanceof HTMLScriptElement) {
      log('Script being inserted', { src: node.src });
      executionStack.push(node.src || 'inline-script');
    }
    return originals.insertBefore.call(this, node, reference) as T;
  };

  // WebSocket interception with persistance
  function createWebSocketProxy() {
    const WSProxy = function (this: WebSocket, url: string | URL, protocols?: string | string[]) {
      log('WebSocket instantiation attempted', { url, protocols });

      // Get stack trace to identify caller
      const stack = new Error().stack;
      log('WebSocket call stack', { stack });

      // Get the current script from execution stack
      const currentScript = executionStack[executionStack.length - 1];
      log('Current executing script', { currentScript });

      // Create actual WebSocket with possibly modified URL
      return new originals.WebSocket(url, protocols);
    } as unknown as typeof WebSocket;

    // Copy prototype and static properties
    // WSProxy.prototype = originals.WebSocket.prototype;
    // WSProxy.CONNECTING = originals.WebSocket.CONNECTING;
    // WSProxy.OPEN = originals.WebSocket.OPEN;
    // WSProxy.CLOSING = originals.WebSocket.CLOSING;
    // WSProxy.CLOSED = originals.WebSocket.CLOSED;

    return WSProxy;
  }

  // Create and install the WebSocket proxy
  const WSProxy = createWebSocketProxy();

  // Use Object.defineProperty to make the override more resilient
  Object.defineProperty(window, 'WebSocket', {
    configurable: true,
    enumerable: true,
    get: () => WSProxy,
    set: (value) => {
      log('Attempt to override WebSocket detected', { value });
      // You might want to throw an error or handle this differently
      return WSProxy;
    }
  });

  // Monitor eval and Function constructor
  window.eval = function (code: string) {
    log('Eval called with code', { codeLength: code.length });
    return originals.eval.call(this, code);
  };

  const FunctionProxy = new Proxy(originals.Function, {
    construct(target, args) {
      log('Function constructor called', { args });
      return new target(...args);
    }
  });
  window.Function = FunctionProxy;

  // Monitor DOM mutations
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLScriptElement) {
            log('Script added through DOM mutation', {
              src: (node as HTMLScriptElement).src
            });
          }
        });
      }
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });

  // Detect if running in an extension context
  //@ts-ignore
  const isExtensionContext = !!(window.chrome && chrome.runtime && chrome.runtime.id);
  log('Extension context detection', { isExtensionContext });

  // Try to hook into extension messaging if available
  //@ts-ignore
  if (isExtensionContext && chrome.runtime.onMessage) {
    //@ts-ignore
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      log('Extension message intercepted', { message, sender });
      return false; // Don't prevent other listeners
    });
  }

  const observerx = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;
      if (entry.entryType === 'resource') {
        if (resourceEntry.initiatorType === 'websocket' || resourceEntry.initiatorType === 'fetch') {
          console.log(`[Resource loaded]: ${entry.name}`, entry);
        }
      }
      if ((entry as any).responseStatus >= 400 || entry.duration === 0) {
        console.log('Resource loading failed:', {
          url: entry.name,
          initiatorType: resourceEntry.initiatorType,
          duration: resourceEntry.duration,
        });
      }
    });
  });

  observerx.observe({ entryTypes: ['resource'] });
  document.addEventListener('securitypolicyviolation', (event: SecurityPolicyViolationEvent) => {
    const violationData: CSPViolationData = {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      disposition: event.disposition,
    };
    console.log('CSP Violation:', violationData);
  });
  log('Early interceptor installed');

}


traceRequests();
// detectFailedConnections();