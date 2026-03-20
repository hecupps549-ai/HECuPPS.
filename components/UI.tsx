"use client";

import React from 'react';
import { CloseIcon } from './Icons';

// ─── Button ──────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const base = "inline-flex items-center justify-center px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: 'bg-brand-black text-white hover:bg-gray-800 dark:bg-white dark:text-brand-black dark:hover:bg-gray-200',
    secondary: 'bg-brand-accent text-white hover:opacity-90',
    outline: 'bg-white text-brand-black border-2 border-brand-black hover:bg-brand-black hover:text-white dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-brand-black',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-brand-black dark:text-white mb-1.5">
        {label}
      </label>
    )}
    <input
      id={id}
      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-brand-border dark:border-gray-800 text-brand-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-black dark:focus:border-brand-accent text-sm transition-colors"
      {...props}
    />
  </div>
);

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-brand-black dark:text-white mb-1.5">
        {label}
      </label>
    )}
    <select
      id={id}
      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-brand-border dark:border-gray-800 text-brand-black dark:text-white focus:outline-none focus:border-brand-black dark:focus:border-brand-accent text-sm transition-colors appearance-none cursor-pointer"
      {...props}
    >
      {children}
    </select>
  </div>
);

// ─── Textarea ────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-brand-black dark:text-white mb-1.5">
        {label}
      </label>
    )}
    <textarea
      id={id}
      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-brand-border dark:border-gray-800 text-brand-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-black dark:focus:border-brand-accent text-sm transition-colors resize-none"
      {...props}
    />
  </div>
);

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-brand-border dark:border-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-brand-border dark:border-gray-800">
          <h3 className="text-lg font-outfit font-bold text-brand-black dark:text-white uppercase tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-black transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-900 border border-brand-border dark:border-gray-800 transition-all duration-200 hover:shadow-md ${className}`}>
    {children}
  </div>
);

// ─── Table ───────────────────────────────────────────────────────────────────

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => (
  <div className="overflow-x-auto border border-brand-border dark:border-gray-800 bg-white dark:bg-gray-900">
    <table className="min-w-full">
      <thead className="bg-brand-light dark:bg-gray-800 border-b border-brand-border dark:border-gray-700">
        <tr>
          {headers.map(header => (
            <th key={header} scope="col" className="px-5 py-3 text-left text-xs font-bold text-brand-black dark:text-white uppercase tracking-widest">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-brand-border dark:divide-gray-800">
        {children}
      </tbody>
    </table>
  </div>
);

export const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-5 py-4 text-sm text-brand-black dark:text-gray-300 whitespace-nowrap">{children}</td>
);

// ─── StatusBadge ─────────────────────────────────────────────────────────────

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    COMPLETED: 'bg-green-50 text-green-700 border-green-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    REFUNDED: 'bg-gray-50 text-gray-600 border-gray-200',
    PAID: 'bg-green-50 text-green-700 border-green-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    OPEN: 'bg-blue-50 text-blue-700 border-blue-200',
    RESOLVED: 'bg-green-50 text-green-700 border-green-200',
    CLOSED: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold border uppercase tracking-wide ${colorMap[status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
};
