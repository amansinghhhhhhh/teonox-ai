{
  "brand": {
    "name": "Teonox.ai",
    "brand_attributes": [
      "trustworthy (industry-real, not hype)",
      "premium but friendly",
      "AI-forward (subtle, not neon)",
      "Hinglish-friendly microcopy",
      "mobile-first conversion-focused"
    ],
    "visual_personality": {
      "style_fusion": [
        "Swiss grid + editorial hierarchy (clarity)",
        "Bento card layout (modern, scannable)",
        "Soft ‘AI-lab’ glow accents (subtle cyan micro-detail)",
        "CSS 3D tilt + blurred orbs (abstract 3D feel without WebGL)"
      ],
      "do_not": [
        "No purple-forward identity (micro cyan only)",
        "No heavy 3D libs / WebGL / Three.js",
        "No raster-photo heavy sections; prefer vectors/glyphs",
        "No transparent sections with dark text; every section must have explicit solid background"
      ]
    }
  },

  "design_tokens": {
    "colors": {
      "notes": {
        "dna": "Preserve Teonox DNA: charcoal/navy + safety orange; modernize with white and a tiny electric-cyan micro-accent.",
        "usage_rule": "Orange is for action + highlights; charcoal/navy is for frames + hero; white is for reading surfaces. Cyan is micro-detail only (rings, tiny glows, charts)."
      },
      "hex_tokens": {
        "brand": {
          "brand-charcoal": "#0B0F14",
          "brand-navy": "#0E1A2B",
          "brand-orange": "#FF6A00",
          "brand-orange-600": "#E85F00",
          "brand-orange-100": "#FFE7D6",
          "micro-cyan": "#2EE6D6"
        },
        "neutrals": {
          "white": "#FFFFFF",
          "paper": "#F7F8FA",
          "mist": "#EEF1F5",
          "slate-900": "#111827",
          "slate-700": "#334155",
          "slate-500": "#64748B",
          "slate-200": "#E2E8F0",
          "slate-100": "#F1F5F9"
        },
        "semantic": {
          "success": "#16A34A",
          "success-soft": "#DCFCE7",
          "warning": "#F59E0B",
          "warning-soft": "#FEF3C7",
          "danger": "#DC2626",
          "danger-soft": "#FEE2E2",
          "info": "#0284C7",
          "info-soft": "#E0F2FE"
        },
        "match_badges": {
          "match-100": "#16A34A",
          "match-80": "#22C55E",
          "match-60": "#84CC16",
          "match-45": "#F59E0B",
          "match-30": "#F97316",
          "match-0": "#EF4444"
        }
      },
      "shadcn_hsl_mapping": {
        "instruction": "Update /app/frontend/src/index.css :root tokens to these HSL values (convert from HEX). Keep a light default theme; use dark surfaces only where specified (hero, nav).",
        "recommended": {
          "--background": "210 33% 98%",
          "--foreground": "222 47% 11%",
          "--card": "0 0% 100%",
          "--card-foreground": "222 47% 11%",
          "--popover": "0 0% 100%",
          "--popover-foreground": "222 47% 11%",
          "--primary": "18 100% 50%",
          "--primary-foreground": "0 0% 100%",
          "--secondary": "210 40% 96%",
          "--secondary-foreground": "222 47% 11%",
          "--muted": "210 40% 96%",
          "--muted-foreground": "215 16% 47%",
          "--accent": "210 40% 96%",
          "--accent-foreground": "222 47% 11%",
          "--destructive": "0 84% 55%",
          "--destructive-foreground": "0 0% 100%",
          "--border": "214 32% 91%",
          "--input": "214 32% 91%",
          "--ring": "18 100% 50%",
          "--radius": "0.75rem"
        }
      },
      "gradients_and_textures": {
        "allowed_gradients": [
          {
            "name": "hero-ember-wash",
            "css": "radial-gradient(900px circle at 20% 10%, rgba(255,106,0,0.18), transparent 55%), radial-gradient(700px circle at 80% 30%, rgba(46,230,214,0.10), transparent 60%), linear-gradient(180deg, #0B0F14 0%, #0E1A2B 55%, #0B0F14 100%)",
            "usage": "Home hero background only (<=20% of viewport should be gradient-dominant; keep content on solid overlay card)."
          },
          {
            "name": "section-mist",
            "css": "linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%)",
            "usage": "Light sections background (reading-friendly)."
          }
        ],
        "noise_overlay": {
          "css": "background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.08%22/%3E%3C/svg%3E');",
          "usage": "Apply as a pseudo-element overlay on hero + dark panels only (opacity 0.06–0.10)."
        }
      }
    },

    "typography": {
      "google_fonts": {
        "heading": {
          "family": "Space Grotesk",
          "weights": [500, 600, 700],
          "why": "Tech-forward, geometric, premium; pairs well with lowercase wordmarks."
        },
        "body": {
          "family": "Figtree",
          "weights": [400, 500, 600],
          "why": "Friendly, highly readable on mobile; modern EdTech vibe."
        },
        "mono_optional": {
          "family": "IBM Plex Mono",
          "weights": [400, 500],
          "usage": "Tiny labels like ‘MATCH 92%’, prompt snippets, code-like chips."
        }
      },
      "type_scale_tailwind": {
        "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]",
        "h2": "text-base md:text-lg leading-relaxed text-slate-500",
        "h3": "text-xl sm:text-2xl font-semibold leading-snug",
        "body": "text-sm sm:text-base leading-relaxed",
        "small": "text-xs sm:text-sm leading-snug",
        "kicker": "text-xs uppercase tracking-[0.18em]"
      },
      "letter_spacing": {
        "headings": "tracking-tight",
        "kickers": "tracking-[0.18em]",
        "buttons": "tracking-[-0.01em]"
      }
    },

    "spacing_and_layout": {
      "container": {
        "max_width": "max-w-6xl",
        "padding": "px-4 sm:px-6 lg:px-8",
        "section_padding": "py-14 sm:py-18 lg:py-24"
      },
      "grid": {
        "system": "12-col on desktop, 6-col on tablet, 4-col on mobile",
        "gap": "gap-4 sm:gap-6 lg:gap-8",
        "bento_rule": "Prefer 2x2 and 3x2 bento clusters; keep one ‘hero card’ larger than others for hierarchy."
      },
      "radii_and_shadows": {
        "radius": {
          "card": "rounded-2xl",
          "button": "rounded-xl",
          "pill": "rounded-full"
        },
        "shadow": {
          "soft": "shadow-[0_10px_30px_rgba(2,6,23,0.10)]",
          "lift": "shadow-[0_18px_50px_rgba(2,6,23,0.16)]",
          "dark_glow": "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.55)]"
        },
        "borders": {
          "light": "border border-slate-200/70",
          "dark": "border border-white/10"
        }
      }
    }
  },

  "logo_spec": {
    "concept": "Lowercase ‘teonox’ wordmark with heritage geometric x-corner DNA evolved into a node/spark motif. Render ‘.ai’ in brand orange. Keep it implementable as pure SVG paths (no filters required).",
    "svg_spec": {
      "viewBox": "0 0 520 120",
      "safe_area": "8px padding all sides",
      "colors": {
        "wordmark": "#0B0F14",
        "dot_ai": "#FF6A00"
      },
      "typography_geometry": {
        "style": "custom geometric sans, rounded corners, slightly condensed",
        "stroke": "none (filled shapes)",
        "x_height": "~62 units",
        "cap_height": "n/a (lowercase)",
        "corner_radius": "6 units"
      },
      "mark": {
        "placement": "Left of wordmark, aligned to x-height center",
        "size": "64x64",
        "construction": [
          "Base is an ‘L-corner’ (heritage x-corner DNA) rotated 45° to feel like an ‘x’ corner.",
          "Add 3 nodes (circles) connected by 2 short segments to imply AI connectivity/spark.",
          "Nodes use brand-orange; corner uses wordmark charcoal."
        ],
        "precise_geometry": {
          "corner_path": "M 18 32 Q 18 18 32 18 L 54 18 Q 60 18 60 24 L 60 30 Q 60 36 54 36 L 38 36 L 38 52 Q 38 58 32 58 L 26 58 Q 18 58 18 50 Z",
          "nodes": [
            {"cx": 54, "cy": 46, "r": 5},
            {"cx": 44, "cy": 56, "r": 4},
            {"cx": 60, "cy": 60, "r": 4}
          ],
          "connectors": [
            {"d": "M 54 46 L 44 56", "stroke": "#FF6A00", "strokeWidth": 3, "strokeLinecap": "round"},
            {"d": "M 54 46 L 60 60", "stroke": "#FF6A00", "strokeWidth": 3, "strokeLinecap": "round"}
          ]
        }
      },
      "wordmark_layout": {
        "text_as_paths": "Recommended: convert final wordmark to paths for pixel-perfect rendering.",
        "kerning": "tight; keep ‘teonox’ compact",
        "dot_ai": "Place immediately after teonox with a small gap (8–10 units). Dot is a circle (r=4). ‘ai’ letters filled orange."
      },
      "implementation_note": "If you don’t want custom letter paths initially, use <text> with Space Grotesk 700 and convert later. Keep .ai in orange via separate <tspan>."
    }
  },

  "components": {
    "component_path": {
      "shadcn_primary": {
        "button": "/app/frontend/src/components/ui/button.jsx",
        "badge": "/app/frontend/src/components/ui/badge.jsx",
        "card": "/app/frontend/src/components/ui/card.jsx",
        "input": "/app/frontend/src/components/ui/input.jsx",
        "textarea": "/app/frontend/src/components/ui/textarea.jsx",
        "tabs": "/app/frontend/src/components/ui/tabs.jsx",
        "dialog": "/app/frontend/src/components/ui/dialog.jsx",
        "sheet": "/app/frontend/src/components/ui/sheet.jsx",
        "drawer": "/app/frontend/src/components/ui/drawer.jsx",
        "progress": "/app/frontend/src/components/ui/progress.jsx",
        "separator": "/app/frontend/src/components/ui/separator.jsx",
        "accordion": "/app/frontend/src/components/ui/accordion.jsx",
        "navigation_menu": "/app/frontend/src/components/ui/navigation-menu.jsx",
        "sonner_toast": "/app/frontend/src/components/ui/sonner.jsx"
      }
    },

    "patterns": {
      "buttons": {
        "primary": {
          "use": "Main CTAs: ‘Join Free Masterclass’, ‘Get Recommendations’, ‘Buy Course’",
          "tailwind": "bg-[#FF6A00] text-white hover:bg-[#E85F00] active:bg-[#D45500] focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white shadow-[0_10px_24px_rgba(255,106,0,0.22)]",
          "shape": "rounded-xl px-5 py-3",
          "micro_interaction": "On hover: translate-y-[-1px] + shadow lift; on press: scale-95 (only on button, not global).",
          "data_testid": "primary-cta-button"
        },
        "secondary": {
          "use": "Less-committal actions: ‘See Syllabus’, ‘Explore Courses’",
          "tailwind": "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#2EE6D6]/35 focus-visible:ring-offset-2",
          "shape": "rounded-xl px-5 py-3",
          "data_testid": "secondary-cta-button"
        },
        "ghost": {
          "use": "Inline actions in chat, filters",
          "tailwind": "bg-transparent text-slate-700 hover:bg-slate-100",
          "shape": "rounded-full px-4 py-2",
          "data_testid": "ghost-action-button"
        }
      },

      "inputs_and_forms": {
        "input": {
          "tailwind": "h-12 rounded-xl border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#FF6A00]/35",
          "helper_text": "text-xs text-slate-500",
          "error_text": "text-xs text-[#DC2626]",
          "data_testid_examples": [
            "masterclass-form-name-input",
            "masterclass-form-email-input",
            "masterclass-form-phone-input"
          ]
        },
        "multi_step_form": {
          "pattern": "Use a top progress indicator + one question per screen on mobile.",
          "components": ["progress", "input", "select", "radio-group"],
          "mobile_rule": "Keep keyboard-friendly: sticky bottom ‘Next’ button; avoid two-column fields on mobile."
        }
      },

      "cards": {
        "base": {
          "tailwind": "rounded-2xl bg-white border border-slate-200/70 shadow-[0_10px_30px_rgba(2,6,23,0.08)]",
          "header": "Space Grotesk 600",
          "data_testid": "content-card"
        },
        "dark_panel": {
          "tailwind": "rounded-2xl bg-[#0B0F14] text-white border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
          "usage": "Chat containers, hero overlay cards"
        }
      },

      "badges": {
        "match_percentage": {
          "rule": "Badge color maps to match tiers; always include numeric % + label.",
          "tiers": [
            {"range": "90–100", "label": "Most Recommended", "bg": "#DCFCE7", "fg": "#166534", "dot": "#16A34A"},
            {"range": "70–89", "label": "Strong Match", "bg": "#ECFCCB", "fg": "#365314", "dot": "#84CC16"},
            {"range": "50–69", "label": "Good Fit", "bg": "#FEF3C7", "fg": "#92400E", "dot": "#F59E0B"},
            {"range": "30–49", "label": "Not Relevant", "bg": "#FFEDD5", "fg": "#9A3412", "dot": "#F97316"},
            {"range": "0–29", "label": "Avoid", "bg": "#FEE2E2", "fg": "#991B1B", "dot": "#EF4444"}
          ],
          "tailwind_template": "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
          "data_testid": "course-match-badge"
        },
        "level_badge": {
          "examples": ["Beginner", "Intermediate", "Advanced"],
          "tailwind": "rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs",
          "data_testid": "course-level-badge"
        }
      },

      "chat_ui": {
        "layout": "Left: conversation thread. Right (desktop): course shelf that reorders. On mobile: shelf becomes a swipeable carousel below chat input.",
        "bubbles": {
          "assistant": "bg-white text-slate-900 border border-slate-200 rounded-2xl rounded-tl-md",
          "user": "bg-[#FF6A00] text-white rounded-2xl rounded-tr-md",
          "meta": "timestamp text-xs text-slate-400"
        },
        "composer": {
          "tailwind": "sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-3",
          "elements": ["textarea autosize", "send button", "quick prompt chips"],
          "data_testid": {
            "thread": "consultant-chat-thread",
            "input": "consultant-chat-input",
            "send": "consultant-chat-send-button"
          }
        }
      },

      "sticky_mobile_cta": {
        "pattern": "Bottom sticky bar with 1 primary CTA + 1 secondary icon action (call/whatsapp).",
        "tailwind": "fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/92 backdrop-blur px-4 py-3",
        "data_testid": "sticky-mobile-cta"
      }
    }
  },

  "pages": {
    "global_shell": {
      "header": {
        "behavior": "Sticky header; on scroll add subtle shadow + reduce height.",
        "layout": "Left logo, center nav (desktop), right primary CTA. Mobile: hamburger opens Sheet with nav + CTA.",
        "data_testid": {
          "nav": "site-header-nav",
          "cta": "site-header-primary-cta"
        }
      },
      "footer": {
        "sections": ["Trust strip", "Links", "Contact/WhatsApp", "Mini signup"],
        "trust_items": ["Made in India", "Live sessions", "Templates worth ₹50,000", "Claude-powered consultant"],
        "data_testid": "site-footer"
      }
    },

    "home": {
      "hero": {
        "structure": [
          "Kicker: ‘Practical AI. Real jobs. No fluff.’",
          "H1: bold promise",
          "H2: one-line clarity",
          "Primary CTA: Join free live masterclass",
          "Secondary CTA: Explore courses",
          "Right-side (desktop) / below (mobile): abstract 3D-feel orb card + ‘₹50,000 resources’ chip"
        ],
        "sample_copy": {
          "kicker": "AI seekho. Kaam pe lagao.",
          "h1": "Job-ready AI skills — without the confusion.",
          "h2": "Students, professionals, business owners, parents — Teonox gives you a clear path from AI-illiterate to AI-literate.",
          "cta": "Join Free Live Masterclass",
          "subcta": "Get templates + resources worth ₹50,000"
        },
        "background": "Use hero-ember-wash gradient + noise overlay + 2 blurred orbs (orange + cyan) moving slowly via Framer Motion.",
        "data_testid": "home-hero"
      },
      "scroll_storytelling": {
        "pattern": "3–5 narrative chapters with a sticky ‘Masterclass’ card that updates copy as you scroll.",
        "chapters": [
          "1: ‘AI is everywhere’ (fast montage of roles)",
          "2: ‘Courses are half-complete’ (two-column compare)",
          "3: ‘Teonox path’ (stepper)",
          "4: ‘Proof’ (results cards teaser)",
          "5: ‘Join live’ (form preview)"
        ],
        "implementation": "Framer Motion useScroll + useTransform; keep animations lightweight (opacity/translate/scale only).",
        "data_testid": "home-scroll-story"
      },
      "masterclass_signup": {
        "pattern": "Multi-step form in a Dialog/Drawer (mobile Drawer).",
        "fields": ["name", "email", "phone/WhatsApp", "audience type", "interest"],
        "trust_microcopy": "No spam. WhatsApp reminders only. Unsubscribe anytime.",
        "data_testid": "masterclass-signup"
      }
    },

    "the_gap": {
      "goal": "Trust-building + competitor gap framing.",
      "layout": [
        "Hero statement + ‘Why most AI courses fail’",
        "Split compare card: Too technical vs Too shallow",
        "4 audience bento: Students / Professionals / Business owners / Parents",
        "Proof strip: instructor credibility, curriculum principles, outcomes",
        "CTA: ‘Tell us your goal → get a path’"
      ],
      "microcopy_samples": {
        "headline": "Most AI courses are half-complete.",
        "sub": "Either they drown you in tools… or they skip the real job workflows.",
        "proof": "We teach what teams actually use — prompts, systems, and repeatable workflows."
      },
      "data_testid": "gap-page"
    },

    "explore_courses": {
      "primary_mode": "AI Course Consultant chatbot",
      "layout_desktop": "Two-pane: left chat (60%), right course shelf (40%) with animated reorder.",
      "layout_mobile": "Single column: audience pills → chat → course shelf carousel → library toggle.",
      "audience_selector": {
        "pattern": "Pill row (ToggleGroup) with 4 options + icons.",
        "data_testid": "audience-selector"
      },
      "course_shelf": {
        "pattern": "Animated list reorder with match badges + ‘why recommended’ tooltip.",
        "data_testid": "course-shelf"
      },
      "library_toggle": {
        "pattern": "Tabs: ‘Consultant’ | ‘Library’",
        "data_testid": "courses-view-toggle"
      }
    },

    "results": {
      "layout": "Vertical story cards; each card is a split before/after with icons + metrics.",
      "card_anatomy": [
        "Role title + scenario",
        "Before column: pain bullets + red/orange status",
        "After column: AI workflow bullets + green status",
        "Recommended course chips (clickable)",
        "Mini metric row: time saved, output, confidence"
      ],
      "data_testid": "results-page"
    },

    "job_risk": {
      "layout_desktop": "Left chatbot, right infographic panel (dial + reasons + course chips).",
      "layout_mobile": "Chat first; infographic collapsible below with sticky ‘Your risk’ summary chip.",
      "infographic": {
        "components": [
          "Probability dial (SVG arc)",
          "Severity gauge (Progress)",
          "Reasons list (Accordion)",
          "Recommended course chips (Badge/Button)"
        ],
        "data_testid": {
          "dial": "job-risk-probability-dial",
          "reasons": "job-risk-reasons",
          "recommendations": "job-risk-course-recommendations"
        }
      }
    }
  },

  "motion": {
    "libraries": {
      "framer_motion": {
        "use_for": ["scroll storytelling", "reorder animations", "hover/press feedback", "sticky CTA transitions"],
        "reduced_motion": "Respect prefers-reduced-motion: disable parallax and large transforms; keep opacity fades only."
      },
      "lottie": {
        "use_for": ["hero abstract loop", "tiny ‘spark’ loader in chat", "success confirmation"],
        "fallback": "If Lottie fails, show static SVG illustration."
      }
    },
    "micro_interactions": {
      "buttons": "hover: y -1px + shadow lift; press: scale 0.97; focus: ring",
      "cards": "hover (desktop only): subtle tilt via CSS transform rotateX/rotateY <= 4deg; disable on touch",
      "chat": "new message: slide-up 8px + fade-in 180ms",
      "course_reorder": "use Framer Motion <Reorder.Group> or layout animations; duration 260–320ms; easing [0.22,1,0.36,1]"
    },
    "scroll_story": {
      "rule": "Keep scroll effects lightweight: translateY, opacity, scale; avoid blur animations on mid-range Android.",
      "sticky_cta": "Sticky masterclass card updates headline per chapter with crossfade (no layout jump)."
    }
  },

  "responsive": {
    "breakpoints": {
      "mobile": "<640px",
      "tablet": "640–1024px",
      "desktop": ">=1024px"
    },
    "rules": [
      "Mobile-first: single column by default; add second pane only at lg.",
      "Sticky bottom CTA visible on mobile except when keyboard open (hide on input focus).",
      "Chat composer must remain reachable above iOS Safari bottom bar (use safe-area-inset-bottom).",
      "Infographic panel collapses into Accordion sections on mobile."
    ]
  },

  "trust_and_microcopy": {
    "tone": {
      "principles": ["clear", "witty-short", "non-cringe Hinglish", "no hype claims without proof"],
      "examples": [
        "‘AI seekhna hai? Pehle clarity chahiye.’",
        "‘Tools nahi — workflows.’",
        "‘Aapka goal batao. Hum path bana denge.’"
      ]
    },
    "trust_signals": [
      "Live masterclass schedule + calendar add",
      "Real outcomes: time saved, output metrics",
      "Curriculum principles: ‘job workflows first’",
      "Transparent course list (7 pilot courses)"
    ],
    "form_labels": {
      "name": "Full name",
      "email": "Email (for resources)",
      "phone": "WhatsApp number (reminders)",
      "audience": "You are a…",
      "interest": "What do you want AI to help with?"
    }
  },

  "image_urls": {
    "note": "Image provider tool failed in this environment. Use vector/SVG + CSS orbs instead of stock photos.",
    "categories": [
      {
        "category": "hero_abstract_assets",
        "description": "Prefer in-house SVG blobs, mesh gradients, node lines. Use Lottie abstract loops from LottieFiles (lightweight).",
        "suggested_sources": [
          "https://lottiefiles.com/search?q=abstract%20gradient",
          "https://lottiefiles.com/search?q=network%20nodes",
          "https://lottiefiles.com/search?q=orb"
        ]
      },
      {
        "category": "icons",
        "description": "Use lucide-react icons only (already typical in shadcn setups).",
        "suggested_sources": ["https://lucide.dev/icons/"]
      }
    ]
  },

  "instructions_to_main_agent": {
    "implementation_notes_js": [
      "Project uses .jsx (not .tsx). Keep components in JS; avoid TS-only patterns.",
      "Do not keep CRA default App.css centering; remove .App-header patterns.",
      "Set global fonts via index.css (import Google Fonts) and Tailwind base styles.",
      "Every interactive element and key info must include data-testid in kebab-case.",
      "Use shadcn components from /src/components/ui (no raw HTML dropdown/calendar/toast).",
      "Use sonner for toasts via /src/components/ui/sonner.jsx."
    ],
    "recommended_new_components": [
      "src/components/TeonoxLogo.jsx (SVG)",
      "src/components/HeroOrbBackground.jsx (Framer Motion orbs + noise)",
      "src/components/ScrollStory.jsx (useScroll chapters)",
      "src/components/MasterclassSignupDrawer.jsx",
      "src/components/CourseShelf.jsx (animated reorder + match badges)",
      "src/components/JobRiskDial.jsx (SVG arc + animation)"
    ]
  }
}

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
