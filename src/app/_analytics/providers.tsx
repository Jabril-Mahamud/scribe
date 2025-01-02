"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  const [isPostHogReady, setIsPostHogReady] = useState(false);

  useEffect(() => {
    // Only initialize PostHog once on the client side
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest",
        ui_host: "https://eu.i.posthog.com",
        loaded: (posthog) => {
          setIsPostHogReady(true);
        }
      });
    } else {
      setIsPostHogReady(true);
    }
  }, []);

  // Only render the provider when PostHog is ready
  if (!isPostHogReady) return null;

  return (
    <PostHogProvider client={posthog}>
      <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
    </PostHogProvider>
  );
}

function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName,
      });
    } else if (!isSignedIn) {
      posthog.reset();
    }
  }, [isSignedIn, user]);

  return children;
}