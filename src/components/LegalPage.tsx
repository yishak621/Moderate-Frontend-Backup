"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface LegalPageProps {
  title: string;
  description: string;
  termlyId: string;
  useIframe?: boolean;
  termlyUrl?: string;
}

export default function LegalPage({
  title,
  description,
  termlyId,
  useIframe = false,
  termlyUrl,
}: LegalPageProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const scriptInjected = useRef(false);
  const embedDivRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const currentTermlyId = useRef<string>(termlyId);

  //TODO: Reset state when route changes or termlyId changes
  useEffect(() => {
    const hasChanged = currentTermlyId.current !== termlyId;

    if (hasChanged || pathname) {
      currentTermlyId.current = termlyId;
      setScriptLoaded(false);
      scriptInjected.current = false;

      if (embedDivRef.current) {
        embedDivRef.current.innerHTML = "";
      }
    }
  }, [termlyId, pathname]);

  useEffect(() => {
    if (embedDivRef.current && !useIframe) {
      embedDivRef.current.setAttribute("name", "termly-embed");
      embedDivRef.current.setAttribute("data-id", termlyId);
    }
  }, [useIframe, termlyId]);

  useEffect(() => {
    if (!useIframe && typeof window !== "undefined" && embedDivRef.current) {
      const scriptId = "termly-jssdk";

      const existingScript = document.getElementById(scriptId);

      if (existingScript) {
        setScriptLoaded(true);

        if (embedDivRef.current) {
          embedDivRef.current.innerHTML = "";
          embedDivRef.current.setAttribute("data-id", termlyId);
          embedDivRef.current.setAttribute("name", "termly-embed");

          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).Termly) {
              try {
                (window as any).Termly.init();
              } catch (error) {
                console.error("Error reinitializing Termly:", error);
              }
            }
          }, 200);
        }
        return;
      }

      if (!scriptInjected.current) {
        (function (d: Document, s: string, id: string) {
          const tjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          const js = d.createElement(s) as HTMLScriptElement;
          js.id = id;
          js.src = "https://app.termly.io/embed-policy.min.js";
          js.async = true;

          js.onload = () => {
            setScriptLoaded(true);
            setTimeout(() => {
              if (typeof window !== "undefined" && (window as any).Termly) {
                try {
                  (window as any).Termly.init();
                } catch (error) {
                  console.error("Error initializing Termly:", error);
                }
              }
            }, 200);
          };

          js.onerror = (error) => {
            console.error("Error loading Termly script:", error);
          };

          if (tjs && tjs.parentNode) {
            tjs.parentNode.insertBefore(js, tjs);
          } else {
            d.head.appendChild(js);
          }
        })(document, "script", scriptId);

        scriptInjected.current = true;
      }
    }
  }, [useIframe, termlyId, pathname]);

  const iframeSrc =
    termlyUrl ||
    `https://app.termly.io/policy-viewer/policy.html?policyUUID=${termlyId}`;

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            {description}
          </p>
        </div>

        {/* Termly Content Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {useIframe ? (
            <iframe
              src={iframeSrc}
              className="w-full min-h-[800px] border-0 rounded-lg"
              title={title}
              allow="fullscreen"
              loading="lazy"
            />
          ) : (
            <div
              ref={embedDivRef}
              id="termly-embed"
              data-id={termlyId}
              className="min-h-[800px] px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
            ></div>
          )}
        </div>

        {!useIframe && !scriptLoaded && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading legal document...</p>
          </div>
        )}
      </div>
    </div>
  );
}
