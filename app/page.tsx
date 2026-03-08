"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Target } from "lucide-react";

// ── Imported Components ────────────────────────────────────────────────
import GuestScreen from "@/components/ui/GuestScreen";
import GoalsModal from "@/components/ui/GoalsModal";
import MetricsCards from "@/components/trading/MetricsCards";
import EquityChart from "@/components/trading/EquityChart";
import TradeHistory from "@/components/trading/TradeHistory";
import TradingCalendar from "@/components/trading/TradingCalendar";
import CalendarDetailModal from "@/components/trading/CalendarDetailModal";
import NukeButton from "@/components/ui/NukeButton";
import TradeForm from "@/components/trading/TradeForm";

// ── Shared Types ───────────────────────────────────────────────────────
import { Trade, FEE_RATE } from "@/components/shared/types";

// ── Force dynamic rendering ────────────────────────────────────────────
export const dynamic = "force-dynamic";

export default function App() {
  const { isSignedIn, user } = useUser();

  // ── State ──────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialInput, setInitialInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [initial, setInitial] = useState(10000);
  const [target, setTarget] = useState(100000);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);
  const [symbol, setSymbol] = useState("");
  const [capitalRisked, setCapitalRisked] = useState("");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());

  const symbolInputRef = useRef<HTMLInputElement | null>(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ── Load / Save Data ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    const savedTrades = localStorage.getItem(`trades_${user.id}`);
    const savedSettings = localStorage.getItem(`settings_${user.id}`);

    if (savedTrades) {
      try {
        setTrades(JSON.parse(savedTrades));
      } catch {}
    }

    if (savedSettings) {
      try {
        const { i, t } = JSON.parse(savedSettings) as { i: number; t: number };
        setInitial(i);
        setTarget(t);
        setInitialInput(i.toString());
        setGoalInput(t.toString());
      } catch {}
    } else {
      setIsModalOpen(true);
    }
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    localStorage.setItem(`trades_${user.id}`, JSON.stringify(trades));
    localStorage.setItem(
      `settings_${user.id}`,
      JSON.stringify({ i: initial, t: target })
    );
  }, [trades, initial, target, isSignedIn, user?.id]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleStart = () => {
    const init = parseFloat(initialInput.replace(/[^0-9.]/g, "")) || 10000;
    const goal = parseFloat(goalInput.replace(/[^0-9.]/g, "")) || 100000;

    if (init > 0 && goal > init) {
      setInitial(init);
      setTarget(goal);
      setIsModalOpen(false);
    }
  };

  const addTrade = () => {
    if (!symbol || !capitalRisked || !entry || !exit || !date) return;

    const capital = parseFloat(capitalRisked);
    const entryPrice = parseFloat(entry);
    const exitPrice = parseFloat(exit);

    if (
      isNaN(capital) ||
      isNaN(entryPrice) ||
      isNaN(exitPrice) ||
      capital <= 0
    ) {
      return;
    }

    const quantity = capital / entryPrice;
    const exitValue = quantity * exitPrice;
    const totalFees = capital * FEE_RATE * 2;
    const netPnlDollar = exitValue - capital - totalFees;
    const netPnlPercent = (netPnlDollar / capital) * 100;

    const tradeDate = date.toISOString().split("T")[0];

    const newTrade: Trade = {
      id: crypto.randomUUID(),
      symbol: symbol.toUpperCase().trim(),
      date: tradeDate,
      capitalRisked: capital,
      quantity,
      entry: entryPrice,
      exit: exitPrice,
      pnlPercent: Number(netPnlPercent.toFixed(4)),
      pnlDollar: Number(netPnlDollar.toFixed(6)),
      fees: Number(totalFees.toFixed(6)),
    };

    setTrades((prev) => [...prev, newTrade]);
    setSymbol("");
    setCapitalRisked("");
    setEntry("");
    setExit("");
    setDate(new Date());
    symbolInputRef.current?.focus();
  };

  const deleteTrade = (id: string) => {
    setTrades((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      const maxPage = Math.max(1, Math.ceil(updated.length / 6));
      if (page > maxPage) setPage(maxPage);
      return updated;
    });
  };

  const nukeData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // ── Formatting Helpers ─────────────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const formatNumber = (num: number): string => {
    const abs = Math.abs(num);
    if (abs >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
    return `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // ── Computed Values ────────────────────────────────────────────────────
  const {
    chartData,
    currentCapital,
    totalReturn,
    winRate,
    totalFeesPaid,
    totalPnlDollar,
  } = useMemo(() => {
    let capital = initial;
    const data: { date: string; capital: number }[] = [
      { date: "Start", capital: Math.round(capital) },
    ];
    let feesAccumulated = 0;

    const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));

    sorted.forEach((trade) => {
      capital += trade.pnlDollar;
      feesAccumulated += trade.fees;
      data.push({
        date: `${trade.symbol} ${formatDate(trade.date)}`,
        capital: Math.round(capital),
      });
    });

    const totalReturn = initial > 0 ? ((capital - initial) / initial) * 100 : 0;
    const winners = trades.filter((t) => t.pnlDollar > 0);
    const winRate =
      trades.length > 0 ? (winners.length / trades.length) * 100 : 0;

    return {
      chartData: data,
      currentCapital: Math.round(capital),
      totalReturn,
      winRate,
      totalFeesPaid: Number(feesAccumulated.toFixed(2)),
      totalPnlDollar: Math.round(capital - initial),
    };
  }, [trades, initial]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Global Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-950 via-black to-zinc-950" />
        <div className="absolute inset-0 bg-linear-to-t from-cyan-900/10 via-transparent to-purple-900/10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-soft-light" />
      </div>

      <SignedOut>
        <GuestScreen
          initialInput={initialInput}
          setInitialInput={setInitialInput}
          goalInput={goalInput}
          setGoalInput={setGoalInput}
        />
      </SignedOut>

      <SignedIn>
        <div className="fixed top-6 right-6 z-50">
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              <UserButton.Action
                label="Manage Goals"
                labelIcon={<Target className="w-5 h-5" />}
                onClick={() => {
                  setInitialInput(initial.toString());
                  setGoalInput(target.toString());
                  setIsModalOpen(true);
                }}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>

        <GoalsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialInput={initialInput}
          setInitialInput={setInitialInput}
          goalInput={goalInput}
          setGoalInput={setGoalInput}
          onSave={handleStart}
          isInitialSetup={initial === 10000 && target === 100000}
        />

        {!isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen px-6 py-16"
          >
            <div className="max-w-7xl mx-auto space-y-16">
              {/* Hero */}
              <div className="text-center py-12">
                <h1 className="text-7xl lg:text-9xl font-black tracking-tight">
                  <span className="bg-linear-to-r from-cyan-400 via-cyan-300 to-white bg-clip-text text-transparent">
                    {formatNumber(initial)}
                  </span>
                  <span className="text-white/30 mx-6">→</span>
                  <span className="bg-linear-to-r from-purple-400 via-pink-400 to-white bg-clip-text text-transparent">
                    {formatNumber(target)}
                  </span>
                </h1>
                <p className="text-4xl mt-8">
                  <span
                    className={
                      totalPnlDollar >= 0 ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {totalPnlDollar >= 0 ? "+" : "−"}
                    {formatNumber(Math.abs(totalPnlDollar))}
                  </span>
                  <span className="text-white/50 ml-4">all time</span>
                </p>
                <p className="text-2xl lg:text-3xl mt-6 text-white/50 font-light tracking-widest">
                  COMPOUND UNTIL FREEDOM
                </p>
              </div>

              <MetricsCards
                currentCapital={currentCapital}
                totalReturn={totalReturn}
                winRate={winRate}
                totalFeesPaid={totalFeesPaid}
                tradesCount={trades.length}
                formatNumber={formatNumber}
              />

              <TradeForm
                symbol={symbol}
                setSymbol={setSymbol}
                capitalRisked={capitalRisked}
                setCapitalRisked={setCapitalRisked}
                entry={entry}
                setEntry={setEntry}
                exit={exit}
                setExit={setExit}
                date={date}
                setDate={setDate}
                onSubmit={addTrade}
                symbolInputRef={
                  symbolInputRef as React.RefObject<HTMLInputElement>
                }
              />

              <div className="grid lg:grid-cols-2 gap-10">
                <TradeHistory
                  trades={trades}
                  page={page}
                  setPage={setPage}
                  deleteTrade={deleteTrade}
                  formatNumber={formatNumber}
                  formatDate={formatDate}
                />
                <EquityChart
                  chartData={chartData}
                  formatNumber={formatNumber}
                />
              </div>

              <TradingCalendar
                trades={trades}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                setSelectedDate={setSelectedDate}
                formatNumber={formatNumber}
              />

              <CalendarDetailModal
                selectedDate={selectedDate}
                onClose={() => setSelectedDate(null)}
                trades={trades}
                formatNumber={formatNumber}
              />

              <NukeButton onNuke={nukeData} />
            </div>
          </motion.div>
        )}
      </SignedIn>
    </>
  );
}
