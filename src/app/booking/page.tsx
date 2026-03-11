"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Video,
  CalendarCheck2,
  Scale,
  Shield,
  Heart,
  Building2,
  Home,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { attorneys as fallbackAttorneys } from "@/data/attorneys";
import { getAttorneys, getServices, submitAppointment, getBookedSlots, type Attorney, type Service, iconMap } from "@/lib/supabase-data";
import Image from "next/image";

// Services will be fetched from Supabase
const defaultLegalServices = [
  { id: "corporate", title: "Corporate Law", description: "Expert guidance for business formations, contracts, mergers, acquisitions, and regulatory compliance across various industries.", icon_name: "Building2", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  { id: "family", title: "Family Law", description: "Compassionate legal support for sensitive matters including divorce, child custody, adoption, and pre-nuptial agreements.", icon_name: "Heart", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30" },
  { id: "criminal", title: "Criminal Defense", description: "Vigorous and ethical representation protecting your constitutional rights and freedom in local and federal criminal matters.", icon_name: "Shield", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  { id: "civil-litigation", title: "Civil Litigation", description: "Experienced advocates for resolving complex disputes in court or through alternative dispute resolution and mediation.", icon_name: "FileText", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
  { id: "real-estate", title: "Real Estate Law", description: "Expert handling of property transactions, zoning, lease agreements, and real estate litigation.", icon_name: "Home", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30" },
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedLawyer, setSelectedLawyer] = useState<Attorney | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>({});
  const [step3Error, setStep3Error] = useState("");
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [attorneys, setAttorneys] = useState<Attorney[]>(fallbackAttorneys.map(a => ({ ...a, educationUndergrad: a.educationUndergrad })));
  const [legalServices, setLegalServices] = useState<Service[]>(defaultLegalServices as any);

  useEffect(() => {
    getAttorneys().then(setAttorneys).catch(console.error);
    getServices().then(data => { if (data.length) setLegalServices(data as any); }).catch(console.error);
  }, []);

  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedLawyer || !selectedDate) {
        setBookedSlots([]);
        return;
      }
      setIsLoadingSlots(true);
      try {
        const slots = await getBookedSlots(selectedLawyer.slug, selectedDate);
        setBookedSlots(slots);
      } catch (error) {
        console.error("Failed to fetch slots", error);
        setBookedSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    fetchBookedSlots();
  }, [selectedLawyer, selectedDate]);

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const generateTimeSlots = () => {
    return ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];
  };
  const availableTimeSlots = generateTimeSlots();

  const handleConfirm = async () => {
    setBookingStatus('sending');
    try {
      await submitAppointment({
        service: selectedService,
        attorney_id: selectedLawyer?.slug || '',
        date: selectedDate,
        time: selectedTime,
        first_name: firstName,
        last_name: lastName,
        email: email,
        notes: notes,
      });
      setBookingStatus('sent');
    } catch {
      setBookingStatus('error');
    }
  };

  const nextStep = () => {
    if (step === 4) {
      const errors: { [key: string]: string } = {};
      if (!firstName.trim()) errors.firstName = "Name is required";
      if (!lastName.trim()) errors.lastName = "Last name is required";
      if (!email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Invalid email";
      }

      setClientErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    setStep(prev => Math.min(prev + 1, 5));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7f8] dark:bg-[#0f1923]">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Header */}
        <section className="relative bg-primary dark:bg-slate-950 overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_60%_40%,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          <div className="container max-w-4xl mx-auto md:px-4 px-6 text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#C5A059] font-bold tracking-widest uppercase text-sm mb-4"
              data-testid="booking-title"
              id="booking-title"
            >
              Appointment Booking
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
            >
              Schedule your consultation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto"
            >
              Step {step} of 5
            </motion.p>
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto mt-8"
            >
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#C5A059] rounded-full shadow-[0_0_10px_rgba(197,160,89,0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mt-3">{Math.round((step / 5) * 100)}% Complete</p>
            </motion.div>
          </div>
        </section>

        <div className="container mt-16 px-6 max-w-7xl mx-auto relative z-20 -mt-10 lg:-mt-16">
          <Card className="border border-slate-100 dark:border-slate-800 shadow-xl xl:shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-colors">
            {/* Multi-step Indicator */}
            <div className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-4 md:px-12 py-8">
              <div className="flex justify-between items-center max-w-4xl mx-auto">
                <StepIndicator current={step} step={1} label="Service" />
                <div className="h-0.5 bg-slate-200 dark:bg-slate-700 flex-1 mx-2 md:mx-6 -mt-6 rounded-full overflow-hidden">
                  {step > 1 && <motion.div layoutId="line1" className="h-full bg-[#C5A059]" initial={{ width: 0 }} animate={{ width: "100%" }} />}
                </div>
                <StepIndicator current={step} step={2} label="Attorney" />
                <div className="h-0.5 bg-slate-200 dark:bg-slate-700 flex-1 mx-2 md:mx-6 -mt-6 rounded-full overflow-hidden">
                  {step > 2 && <motion.div layoutId="line2" className="h-full bg-[#C5A059]" initial={{ width: 0 }} animate={{ width: "100%" }} />}
                </div>
                <StepIndicator current={step} step={3} label="Schedule" />
                <div className="h-0.5 bg-slate-200 dark:bg-slate-700 flex-1 mx-2 md:mx-6 -mt-6 rounded-full overflow-hidden">
                  {step > 3 && <motion.div layoutId="line3" className="h-full bg-[#C5A059]" initial={{ width: 0 }} animate={{ width: "100%" }} />}
                </div>
                <StepIndicator current={step} step={4} label="Details" />
                <div className="h-0.5 bg-slate-200 dark:bg-slate-700 flex-1 mx-2 md:mx-6 -mt-6 rounded-full overflow-hidden">
                  {step > 4 && <motion.div layoutId="line4" className="h-full bg-[#C5A059]" initial={{ width: 0 }} animate={{ width: "100%" }} />}
                </div>
                <StepIndicator current={step} step={5} label="Confirm" />
              </div>
            </div>

            <CardContent className="p-8 md:p-16">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Legal Service */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-3 tracking-tight">Select Legal Service</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-lg min-h-[40px]">Choose the area of law that best matches your needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {legalServices.map((service) => {
                        const Icon = iconMap[service.icon_name] || ShieldCheck;
                        return (
                          <div
                            key={service.id}
                            onClick={() => {
                              setSelectedService(service.title);
                              setTimeout(nextStep, 300); // Slight delay for smooth visual feedback
                            }}
                            data-testid="service-card"
                            className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group relative overflow-hidden flex flex-col items-center text-center ${selectedService === service.title
                              ? "border-[#C5A059] bg-[#C5A059]/5 shadow-[0_8px_30px_rgba(197,160,89,0.15)] scale-[1.02]"
                              : "border-slate-100 dark:border-slate-800 hover:border-[#C5A059]/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:-translate-y-1"
                              }`}
                          >
                            {selectedService === service.title && (
                              <div className="absolute top-4 right-4 text-[#C5A059]">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="h-6 w-6" /></motion.div>
                              </div>
                            )}
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 text-[#C5A059] bg-[#C5A059]/10`}>
                              <Icon className="h-8 w-8" />
                            </div>
                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-50 group-hover:text-[#C5A059] transition-colors mb-2 tracking-tight">{service.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{service.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Choose Lawyer */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-3 tracking-tight" data-testid="attorney-selection-title">Choose Attorney</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Our senior partners specialize in diverse areas of law.</p>
                      </div>
                      <Button variant="ghost" className="text-slate-400 hover:text-[#C5A059] font-black uppercase tracking-widest text-[10px] py-6 cursor-pointer border-2 border-transparent hover:border-[#C5A059]/20 rounded-xl transition-all" onClick={prevStep}>
                        Change Service
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {attorneys.map((lawyer) => (
                        <div
                          key={lawyer.id}
                          onClick={() => {
                            setSelectedLawyer(lawyer);
                            setTimeout(nextStep, 300);
                          }}
                          data-testid="attorney-card"
                          className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex items-center gap-6 group relative overflow-hidden ${selectedLawyer?.id === lawyer.id
                            ? "border-[#C5A059] bg-[#C5A059]/5 shadow-[0_8px_30px_rgba(197,160,89,0.15)] scale-[1.02]"
                            : "border-slate-100 dark:border-slate-800 hover:border-[#C5A059]/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:-translate-y-1"
                            }`}
                        >
                          {selectedLawyer?.id === lawyer.id && (
                            <div className="absolute top-4 right-4 text-[#C5A059]">
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="h-6 w-6" /></motion.div>
                            </div>
                          )}
                          <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/10 dark:ring-slate-800 transition-transform duration-700 group-hover:scale-110 shrink-0 relative">
                            <Image src={lawyer.image} alt={lawyer.name} fill sizes="80px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-50 group-hover:text-[#C5A059] transition-colors truncate tracking-tight">{lawyer.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-2">{lawyer.role}</p>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                              <ShieldCheck className="h-4 w-4" />
                              <span className="font-medium truncate">{lawyer.specialty}</span>
                            </div>
                          </div>
                          <ChevronRight className={`h-6 w-6 absolute right-6 transition-all duration-300 ${selectedLawyer?.id === lawyer.id ? "text-[#C5A059] opacity-0" : "text-slate-300 group-hover:text-[#C5A059] group-hover:translate-x-1"}`} />
                        </div>
                      ))}
                    </div>
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="ghost" className="rounded-2xl cursor-pointer py-6 font-bold gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={prevStep}>
                        <ChevronLeft className="h-4 w-4" /> Back to Services
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Select Date & Time */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-3 tracking-tight">Select Date & Time</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Availability updated for <span className="text-[#C5A059] font-black">{selectedLawyer?.name}</span></p>
                      </div>
                      <Button variant="ghost" className="py-6 cursor-pointer text-slate-400 hover:text-[#C5A059] font-black uppercase tracking-widest text-[10px] border-2 border-transparent hover:border-[#C5A059]/20 rounded-xl transition-all" onClick={prevStep}>
                        Change Attorney
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation Date</Label>
                        <div className="p-8 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/30 text-center space-y-6 shadow-sm">
                          <div className="flex justify-between items-center px-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <p className="font-black text-slate-900 dark:text-slate-50 text-sm uppercase tracking-widest">
                              {monthNames[currentMonth]} {currentYear}
                            </p>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-3">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                              <span key={`header-${i}`} className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 py-1">{d}</span>
                            ))}
                            {[...Array(firstDay)].map((_, i) => (
                              <div key={`empty-${i}`} className="h-12 w-12" />
                            ))}
                            {[...Array(daysInMonth)].map((_, i) => {
                              const day = i + 1;
                              const dateObj = new Date(currentYear, currentMonth, day);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const isPast = dateObj < today;

                              const dateString = `${monthNames[currentMonth].substring(0, 3)} ${day}, ${currentYear}`;
                              const isSelected = selectedDate === dateString;

                              return (
                                <button
                                  key={`day-${i}`}
                                  disabled={isPast}
                                  onClick={() => {
                                    setSelectedDate(dateString);
                                    setSelectedTime(""); // Reset time when date changes
                                  }}
                                  className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 ${isSelected
                                    ? "bg-primary dark:bg-[#C5A059] text-white shadow-xl shadow-primary/20 dark:shadow-[#C5A059]/30 scale-110"
                                    : isPast
                                      ? "bg-transparent text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                                      : "bg-white dark:bg-slate-900 hover:bg-[#C5A059]/10 text-slate-600 dark:text-slate-300 hover:text-[#C5A059] border border-slate-100 dark:border-slate-800"
                                    }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {selectedDate ? `Available Slots for ${selectedDate}` : "Select a date to view slots"}
                        </Label>
                        {isLoadingSlots ? (
                          <div className="h-full flex items-center justify-center min-h-[200px]">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full" />
                          </div>
                        ) : !selectedDate ? (
                          <div className="h-full flex flex-col items-center justify-center min-h-[200px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 bg-slate-50/50 dark:bg-slate-800/30">
                            <CalendarCheck2 className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-slate-500 font-medium text-sm">Please select a date on the calendar first.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {availableTimeSlots.map(time => {
                              const isBooked = bookedSlots.includes(time);
                              return (
                                <button
                                  key={time}
                                  disabled={isBooked}
                                  onClick={() => setSelectedTime(time)}
                                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 group ${selectedTime === time
                                    ? "border-[#C5A059] bg-[#C5A059]/5 text-[#C5A059] shadow-md"
                                    : isBooked
                                      ? "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#C5A059]/30 text-slate-600 dark:text-slate-300 hover:-translate-y-1"
                                    }`}
                                >
                                  <Clock className={`h-5 w-5 ${selectedTime === time ? "text-[#C5A059]" : isBooked ? "text-slate-300 dark:text-slate-600" : "text-slate-400 group-hover:text-[#C5A059] transition-colors"}`} />
                                  <span className={`font-black tracking-tight ${isBooked ? "line-through" : ""}`}>{time}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <Button variant="ghost" className="py-6 cursor-pointer rounded-2xl font-bold gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={prevStep}>
                        <ChevronLeft className="h-5 w-5" /> Back
                      </Button>
                      <Button
                        id="booking-next-step-3"
                        data-testid="booking-next-step"
                        className="bg-primary dark:bg-[#C5A059] text-white px-12 py-7 cursor-pointer hover:bg-primary/90 dark:hover:bg-[#C5A059]/90 hover:scale-[1.02] rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 dark:shadow-[#C5A059]/30 disabled:opacity-50 transition-all"
                        onClick={() => {
                          if (!selectedDate || !selectedTime) {
                            setStep3Error("Please select both a date and an available time slot.");
                            return;
                          }
                          setStep3Error("");
                          nextStep();
                        }}
                      >
                        Client Details <ChevronRight className="ml-3 h-5 w-5" />
                      </Button>
                    </div>
                    {step3Error && (
                      <div className="text-red-500 text-sm font-bold text-center w-full pb-4">
                        {step3Error}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Client Information */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Client Information</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-lg">Please provide accurate contact details for the consultation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                      <div className="space-y-3">
                        <Label htmlFor="first-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">First Name</Label>
                        <Input id="first-name" placeholder="Sarah" className={`h-14 rounded-2xl border-2 bg-slate-50/50 dark:bg-slate-800/30 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all px-6 font-bold shadow-sm ${clientErrors.firstName ? 'border-red-500' : 'border-slate-100 dark:border-slate-800'}`} value={firstName} onChange={e => { setFirstName(e.target.value); setClientErrors(prev => ({ ...prev, firstName: '' })); }} />
                        {clientErrors.firstName && <p className="text-red-500 text-sm font-medium pl-1">{clientErrors.firstName}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="last-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Last Name</Label>
                        <Input id="last-name" placeholder="Miller" className={`h-14 rounded-2xl border-2 bg-slate-50/50 dark:bg-slate-800/30 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all px-6 font-bold shadow-sm ${clientErrors.lastName ? 'border-red-500' : 'border-slate-100 dark:border-slate-800'}`} value={lastName} onChange={e => { setLastName(e.target.value); setClientErrors(prev => ({ ...prev, lastName: '' })); }} />
                        {clientErrors.lastName && <p className="text-red-500 text-sm font-medium pl-1">{clientErrors.lastName}</p>}
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Address</Label>
                        <Input id="email" type="email" placeholder="sarah.m@example.com" className={`h-14 rounded-2xl border-2 bg-slate-50/50 dark:bg-slate-800/30 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all px-6 font-bold shadow-sm ${clientErrors.email ? 'border-red-500' : 'border-slate-100 dark:border-slate-800'}`} value={email} onChange={e => { setEmail(e.target.value); setClientErrors(prev => ({ ...prev, email: '' })); }} />
                        {clientErrors.email && <p className="text-red-500 text-sm font-medium pl-1">{clientErrors.email}</p>}
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Briefly describe your case</Label>
                        <textarea
                          id="notes"
                          className="w-full min-h-[160px] rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 px-6 py-5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/30 focus-visible:border-[#C5A059] disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none shadow-sm"
                          placeholder="Please provide details about your situation..."
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <Button variant="ghost" className="py-6 cursor-pointer rounded-2xl font-bold gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={prevStep}>
                        <ChevronLeft className="h-5 w-5" /> Back
                      </Button>
                      <Button
                        className="bg-primary dark:bg-[#C5A059] text-white px-12 py-7 cursor-pointer hover:bg-primary/90 dark:hover:bg-[#C5A059]/90 hover:scale-[1.02] rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 dark:shadow-[#C5A059]/30 disabled:opacity-50 transition-all"
                        onClick={nextStep}
                      >
                        Review Booking <ChevronRight className="ml-3 h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Review & Confirm */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-10 text-center"
                  >
                    <div className="max-w-2xl mx-auto">
                      <h3 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight" data-testid="review-heading">Review</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium mt-3 text-lg">Finalize your consultation details at Justice Law Center.</p>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-[#0f1923] rounded-[3rem] p-12 border-2 border-slate-100 dark:border-slate-800 max-w-2xl mx-auto space-y-10 shadow-xl dark:shadow-2xl">
                      <div className="flex items-center gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
                        <div className="h-24 w-24 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white dark:ring-slate-800 shrink-0 relative">
                          <Image src={selectedLawyer?.image || ''} alt={selectedLawyer?.name || ''} fill sizes="96px" className="object-cover scale-105" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-2" data-testid="attorney-label">Attorney</p>
                          <h4 className="text-3xl font-black text-slate-900 dark:text-slate-50 truncate tracking-tight">{selectedLawyer?.name}</h4>
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{selectedLawyer?.specialty}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-left">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service</p>
                          <p className="text-base font-black text-primary dark:text-[#C5A059]">
                            {legalServices.find(s => s.title === selectedService)?.title || selectedService || "—"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</p>
                          <div className="flex items-center gap-3 text-primary dark:text-[#C5A059]">
                            <CalendarCheck2 className="h-5 w-5" />
                            <p className="text-base font-black">{selectedDate} at {selectedTime}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                          <div className="flex items-center gap-3 text-primary dark:text-[#C5A059]">
                            <Video className="h-5 w-5" />
                            <p className="text-base font-black">Video Consultation</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 flex flex-col items-center gap-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm font-bold bg-white dark:bg-slate-900/50 px-6 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 w-full justify-center">
                          <ShieldCheck className="h-5 w-5 text-emerald-500" />
                          <span>Confidentiality protected by Attorney-Client Privilege.</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row justify-center gap-6">
                      <Button variant="ghost" className="rounded-2xl font-black uppercase cursor-pointer tracking-widest text-[11px] px-10 py-7 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all" onClick={prevStep}>
                        Modify Details
                      </Button>
                      <Button
                        id="booking-confirm-btn"
                        data-testid="booking-confirm-btn"
                        disabled={bookingStatus === 'sending'}
                        onClick={handleConfirm}
                        className="bg-primary dark:bg-[#C5A059] text-white px-16 py-7 cursor-pointer hover:bg-primary/90 dark:hover:bg-[#C5A059]/90 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 dark:shadow-[#C5A059]/30 transition-all hover:scale-[1.02]">
                        {bookingStatus === 'sending' ? 'Confirming...' : bookingStatus === 'sent' ? '✓ Appointment Confirmed!' : bookingStatus === 'error' ? 'Error — Retry' : 'Confirm Appointment'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StepIndicator({ current, step, label }: { current: number, step: number, label: string }) {
  const isActive = current === step;
  const isCompleted = current > step;

  return (
    <div className="flex flex-col items-center group z-10">
      <div className={`h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 relative ${isActive
        ? "bg-primary dark:bg-[#C5A059] text-white shadow-xl shadow-primary/30 dark:shadow-[#C5A059]/30 scale-110"
        : isCompleted
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
          : "bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 border-2 border-slate-100 dark:border-slate-800"
        }`}>
        {isCompleted ? <CheckCircle2 className="h-6 w-6 md:h-7 md:w-7" /> : step}
        {isActive && (
          <motion.div
            layoutId="activeGlow"
            className="absolute inset-0 bg-primary dark:bg-[#C5A059] rounded-2xl blur-xl opacity-30 -z-10"
          />
        )}
      </div>
      <span className={`mt-4 md:mt-5 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isActive || isCompleted ? "text-slate-900 dark:text-slate-50" : "text-slate-400 dark:text-slate-600"
        }`}>
        {label}
      </span>
    </div>
  );
}
