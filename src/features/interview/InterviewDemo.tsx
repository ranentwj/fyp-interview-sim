"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  demoPersona,
  demoScenario,
  getDemoResponse,
  initialMessages,
  type DemoMessage,
} from "./demo-data";
import styles from "./InterviewDemo.module.css";

export function InterviewDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>(initialMessages);
  const [question, setQuestion] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const pendingReplyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const messagesContainer = messagesRef.current;

    messagesContainer?.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isResponding]);

  useEffect(() => {
    return () => {
      if (pendingReplyRef.current) {
        clearTimeout(pendingReplyRef.current);
      }
    };
  }, []);

  function sendQuestion() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isResponding) {
      return;
    }

    const learnerMessage: DemoMessage = {
      id: `learner-${Date.now()}`,
      speaker: "learner",
      text: trimmedQuestion,
    };

    setMessages((currentMessages) => [...currentMessages, learnerMessage]);
    setQuestion("");
    setIsResponding(true);

    pendingReplyRef.current = setTimeout(() => {
      const personaMessage: DemoMessage = {
        id: `persona-${Date.now()}`,
        speaker: "persona",
        text: getDemoResponse(trimmedQuestion),
      };

      setMessages((currentMessages) => [...currentMessages, personaMessage]);
      setIsResponding(false);
      pendingReplyRef.current = null;
    }, 650);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendQuestion();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  }

  function resetInterview() {
    if (pendingReplyRef.current) {
      clearTimeout(pendingReplyRef.current);
      pendingReplyRef.current = null;
    }

    setMessages(initialMessages);
    setQuestion("");
    setIsResponding(false);
  }

  return (
    <main className={styles.appShell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark} aria-hidden="true">
            IS
          </div>
          <div>
            <div className={styles.brandName}>InterviewSim</div>
            <div className={styles.brandCaption}>User interview practice</div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <div className={styles.prototypeBadge}>Frontend prototype</div>
        </div>
      </header>

      <section className={styles.workspace} aria-label="Interview practice workspace">
        <aside className={styles.sidebar}>
          <div>
            <p className={styles.eyebrow}>Practice scenario</p>
            <h1 className={styles.scenarioTitle}>{demoScenario.title}</h1>
            <div className={styles.scenarioMeta}>
              <span className={styles.metaPill}>{demoScenario.category}</span>
              <span className={styles.metaPill}>{demoScenario.duration}</span>
            </div>
          </div>

          <p className={styles.brief}>{demoScenario.brief}</p>

          <section className={styles.personaCard} aria-label="Virtual user profile">
            <div className={styles.personaHeader}>
              <div className={styles.avatar} aria-hidden="true">
                {demoPersona.initials}
              </div>
              <div>
                <h2 className={styles.personaName}>{demoPersona.name}</h2>
                <p className={styles.personaRole}>{demoPersona.role}</p>
              </div>
            </div>

            <div className={styles.personaFacts}>
              <div>
                <span className={styles.factLabel}>Age</span>
                <span className={styles.factValue}>{demoPersona.age}</span>
              </div>
              <div>
                <span className={styles.factLabel}>Location</span>
                <span className={styles.factValue}>{demoPersona.location}</span>
              </div>
            </div>

            <div className={styles.traits} aria-label="Persona traits">
              {demoPersona.traits.map((trait) => (
                <span className={styles.trait} key={trait}>
                  {trait}
                </span>
              ))}
            </div>
          </section>

          <section className={styles.objective} aria-label="Interview objective">
            <p className={styles.objectiveLabel}>Your objective</p>
            <p className={styles.objectiveText}>{demoScenario.objective}</p>
          </section>

          <p className={styles.sidebarFooter}>
            This is a fictional educational scenario. Avoid proposing solutions until you
            understand the user&apos;s experience.
          </p>
        </aside>

        <section className={styles.interviewPanel} aria-label="Text interview">
          <header className={styles.interviewHeader}>
            <div>
              <div className={styles.liveStatus}>
                <span className={styles.statusDot} aria-hidden="true" />
                Text interview in progress
              </div>
              <p className={styles.headerSubtext}>Ask open questions and follow up on what you hear.</p>
            </div>
            <button className={styles.resetButton} type="button" onClick={resetInterview}>
              Reset interview
            </button>
          </header>

          <div
            ref={messagesRef}
            className={styles.messages}
            aria-live="polite"
            aria-busy={isResponding}
          >
            {messages.map((message) => {
              const isLearner = message.speaker === "learner";

              return (
                <article
                  className={`${styles.messageRow} ${isLearner ? styles.messageRowLearner : ""}`}
                  key={message.id}
                >
                  {!isLearner && (
                    <div className={styles.messageAvatar} aria-hidden="true">
                      {demoPersona.initials}
                    </div>
                  )}
                  <div className={styles.messageContent}>
                    <p className={styles.speakerLabel}>{isLearner ? "You" : demoPersona.name}</p>
                    <p className={`${styles.bubble} ${isLearner ? styles.learnerBubble : ""}`}>
                      {message.text}
                    </p>
                  </div>
                </article>
              );
            })}

            {isResponding && (
              <article className={styles.messageRow} aria-label={`${demoPersona.name} is responding`}>
                <div className={styles.messageAvatar} aria-hidden="true">
                  {demoPersona.initials}
                </div>
                <div className={styles.messageContent}>
                  <p className={styles.speakerLabel}>{demoPersona.name}</p>
                  <div className={styles.bubble}>
                    <span className={styles.thinking} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </article>
            )}
          </div>

          <div className={styles.composerArea}>
            <p className={styles.futureCoach}>
              Interview coaching and safety guidance will be added in a later milestone.
            </p>
            <form className={styles.composer} onSubmit={handleSubmit}>
              <textarea
                aria-label="Interview question"
                className={styles.input}
                disabled={isResponding}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Alex an open-ended question…"
                rows={2}
                value={question}
              />
              <button
                className={styles.sendButton}
                disabled={!question.trim() || isResponding}
                type="submit"
              >
                Send
              </button>
            </form>
            <p className={styles.inputHint}>Enter to send · Shift + Enter for a new line</p>
          </div>
        </section>
      </section>
    </main>
  );
}
