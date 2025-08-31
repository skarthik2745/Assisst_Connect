import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, MessageCircle, Plus, MoreHorizontal, Edit3, Trash2, Pin, Search, X } from 'lucide-react';

interface PresetPhrasesProps {
  onClose: () => void;
}

interface Phrase {
  id: string;
  text: string;
  language?: string;
  useCount: number;
  isPinned: boolean;
  createdAt: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isSystem: boolean;
  phrases: Phrase[];
}

const systemCategories: Category[] = [
  {
    id: 'greetings',
    name: 'Greetings & Introductions',
    color: 'blue',
    isSystem: true,
    phrases: [
      { id: '1', text: "Hello!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '2', text: "Hi there!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '3', text: "Good morning!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '4', text: "Good afternoon!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '5', text: "Good evening!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '6', text: "How are you?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '7', text: "How are you doing?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '8', text: "Nice to meet you!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '9', text: "Pleased to meet you!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '10', text: "What's your name?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '11', text: "My name is...", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '12', text: "I'm...", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '13', text: "Welcome!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '14', text: "How's it going?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '15', text: "Great to see you!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'courtesy',
    name: 'Polite Expressions & Courtesy',
    color: 'green',
    isSystem: true,
    phrases: [
      { id: '16', text: "Please", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '17', text: "Thank you", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '18', text: "Thank you very much", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '19', text: "Thanks a lot", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '20', text: "You're welcome", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '21', text: "Excuse me", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '22', text: "I'm sorry", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '23', text: "Pardon me", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '24', text: "No problem", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '25', text: "Don't mention it", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '26', text: "I apologize", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '27', text: "That's okay", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '28', text: "No worries", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '29', text: "My pleasure", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '30', text: "Bless you", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'help',
    name: 'Help & Emergency',
    color: 'red',
    isSystem: true,
    phrases: [
      { id: '31', text: "Can you help me?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '32', text: "I need help", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '33', text: "Please help me", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '34', text: "Call the doctor!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '35', text: "Call an ambulance!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '36', text: "I'm in danger", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '37', text: "Emergency!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '38', text: "Call the police!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '39', text: "I need medical help", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '40', text: "Help me please!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '41', text: "I'm lost", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '42', text: "Can you call my family?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '43', text: "I need assistance", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '44', text: "This is urgent", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '45', text: "I'm hurt", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'appointments',
    name: 'Appointments & Scheduling',
    color: 'purple',
    isSystem: true,
    phrases: [
      { id: '46', text: "I would like to book an appointment.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '47', text: "Can we reschedule?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '48', text: "What time suits you?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '49', text: "Does ___ work for you?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '50', text: "Please confirm the meeting.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '51', text: "I have an appointment at ___.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '52', text: "I will be there at ___.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '53', text: "I am running late by ___ minutes.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '54', text: "I have arrived.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '55', text: "How long will it take?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '56', text: "When are you available?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '57', text: "Let's meet today.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '58', text: "Let's meet tomorrow.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '59', text: "Please send me the location.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '60', text: "Please share the meeting link.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'money',
    name: 'Money & Payments',
    color: 'yellow',
    isSystem: true,
    phrases: [
      { id: '61', text: "How much does it cost?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '62', text: "Is there a discount?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '63', text: "That is too expensive.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '64', text: "That is affordable.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '65', text: "Do you accept UPI?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '66', text: "I will pay by cash.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '67', text: "I will pay by card.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '68', text: "Please send the bill.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '69', text: "Please give me a receipt.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '70', text: "Can you split the bill?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '71', text: "Keep the change.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '72', text: "I need change.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '73', text: "Refund, please.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '74', text: "This is the wrong amount.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '75', text: "Thank you for the bill.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'home',
    name: 'Home & Accommodation',
    color: 'indigo',
    isSystem: true,
    phrases: [
      { id: '76', text: "I need a room.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '77', text: "I have a reservation.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '78', text: "Please clean the room.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '79', text: "The room is fine.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '80', text: "The room is not clean.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '81', text: "The fan is not working.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '82', text: "The light is not working.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '83', text: "Please fix the electricity.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '84', text: "Please fix the water supply.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '85', text: "Where is the laundry?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '86', text: "Do you have Wi-Fi?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '87', text: "What is the Wi-Fi password?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '88', text: "Please bring drinking water.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '89', text: "I want to check out.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '90', text: "I want to extend my stay.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'technology',
    name: 'Technology & Connectivity',
    color: 'teal',
    isSystem: true,
    phrases: [
      { id: '91', text: "The internet is not working.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '92', text: "Please connect to Wi-Fi.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '93', text: "The mobile network is weak.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '94', text: "Can you share the hotspot?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '95', text: "My phone is charging.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '96', text: "I need a charger.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '97', text: "Do you have a Type-C cable?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '98', text: "Please restart the device.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '99', text: "The app is not opening.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '100', text: "The screen is freezing.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '101', text: "Please unmute the device.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '102', text: "Please increase the volume.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '103', text: "Please decrease the volume.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '104', text: "Please turn on Bluetooth.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '105', text: "Please turn off Bluetooth.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'preferences',
    name: 'Preferences & Feedback',
    color: 'pink',
    isSystem: true,
    phrases: [
      { id: '106', text: "I like this.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '107', text: "I don't like this.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '108', text: "Please make it less spicy.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '109', text: "Please make it more spicy.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '110', text: "No sugar, please.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '111', text: "Less salt, please.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '112', text: "I am allergic to ___.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '113', text: "I prefer vegetarian.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '114', text: "I prefer non-vegetarian.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '115', text: "Please make it hot.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '116', text: "Please make it cold.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '117', text: "This is perfect.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '118', text: "This needs improvement.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '119', text: "I am satisfied.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '120', text: "I am not satisfied.", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'conversation',
    name: 'Daily Conversations',
    color: 'purple',
    isSystem: true,
    phrases: [
      { id: '121', text: "How's your day?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '122', text: "What are you doing?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '123', text: "Where are you from?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '124', text: "I'm from...", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '125', text: "What do you do?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '126', text: "I work as...", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '127', text: "How old are you?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '128', text: "I'm... years old", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '129', text: "Do you speak English?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '130', text: "I don't understand", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '131', text: "Can you repeat that?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '132', text: "Speak slowly please", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '133', text: "What does this mean?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '134', text: "I'm learning English", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '135', text: "That's interesting", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'responses',
    name: 'Responses',
    color: 'indigo',
    isSystem: true,
    phrases: [
      { id: '136', text: "Yes", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '137', text: "No", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '138', text: "Maybe", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '139', text: "I don't know", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '140', text: "I'm not sure", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '141', text: "Definitely", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '142', text: "Absolutely", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '143', text: "Of course", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '144', text: "I think so", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '145', text: "I don't think so", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '146', text: "That's right", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '147', text: "That's wrong", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '148', text: "I agree", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '149', text: "I disagree", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '150', text: "Maybe later", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'navigation',
    name: 'Navigation & Travel',
    color: 'yellow',
    isSystem: true,
    phrases: [
      { id: '151', text: "Where is...?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '152', text: "How do I get to...?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '153', text: "Where is the bus stop?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '154', text: "Where is the train station?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '155', text: "How far is it?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '156', text: "Is it walking distance?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '157', text: "Can you show me the way?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '158', text: "I'm looking for...", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '159', text: "Turn left", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '160', text: "Turn right", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '161', text: "Go straight", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '162', text: "It's nearby", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '163', text: "It's far from here", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '164', text: "Take the bus", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '165', text: "Take the train", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'food',
    name: 'Food & Ordering',
    color: 'orange',
    isSystem: true,
    phrases: [
      { id: '166', text: "I'm hungry", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '167', text: "I'm thirsty", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '168', text: "I would like to order", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '169', text: "What do you recommend?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '170', text: "I'll have...", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '171', text: "Can I see the menu?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '172', text: "How much does it cost?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '173', text: "The bill, please", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '174', text: "I'm vegetarian", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '175', text: "I have allergies", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '176', text: "This is delicious", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '177', text: "I need water", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '178', text: "Coffee, please", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '179', text: "No sugar, please", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '180', text: "To go, please", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'health',
    name: 'Health & Feelings',
    color: 'pink',
    isSystem: true,
    phrases: [
      { id: '181', text: "I'm tired", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '182', text: "I don't feel well", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '183', text: "I'm sick", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '184', text: "I have a headache", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '185', text: "I need medicine", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '186', text: "I'm happy", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '187', text: "I'm sad", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '188', text: "I'm worried", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '189', text: "I'm excited", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '190', text: "I'm nervous", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '191', text: "I feel better", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '192', text: "I'm in pain", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '193', text: "I need to rest", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '194', text: "I'm stressed", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '195', text: "I'm fine", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'work',
    name: 'Work & Study',
    color: 'teal',
    isSystem: true,
    phrases: [
      { id: '196', text: "I'm a student", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '197', text: "I'm working", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '198', text: "I need to study", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '199', text: "Can you explain again?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '200', text: "I don't understand this", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '201', text: "I have a meeting", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '202', text: "I'm busy right now", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '203', text: "I need to finish my work", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '204', text: "What time is the class?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '205', text: "I have homework", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '206', text: "I'm taking a break", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '207', text: "I need help with this", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '208', text: "Can you teach me?", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '209', text: "I'm learning", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '210', text: "Good job!", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  },
  {
    id: 'farewells',
    name: 'Farewells',
    color: 'gray',
    isSystem: true,
    phrases: [
      { id: '211', text: "Goodbye", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '212', text: "Bye", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '213', text: "See you later", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '214', text: "See you soon", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '215', text: "Take care", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '216', text: "Have a good day", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '217', text: "Have a good night", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '218', text: "Until next time", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '219', text: "Catch you later", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '220', text: "Talk to you soon", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '221', text: "Safe travels", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '222', text: "Good luck", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '223', text: "Have fun", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '224', text: "Enjoy your day", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() },
      { id: '225', text: "See you tomorrow", language: 'en', useCount: 0, isPinned: false, createdAt: Date.now() }
    ]
  }
];

const PresetPhrases: React.FC<PresetPhrasesProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('greetings');
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPhrase, setShowAddPhrase] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingPhrase, setEditingPhrase] = useState<string | null>(null);
  const [speakingPhrase, setSpeakingPhrase] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('presetPhrases');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.length < systemCategories.length) {
          setCategories(systemCategories);
        } else {
          setCategories(parsed);
        }
      } catch {
        setCategories(systemCategories);
      }
    } else {
      setCategories(systemCategories);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('presetPhrases', JSON.stringify(categories));
  }, [categories]);

  const speakPhrase = (text: string, phraseId: string) => {
    if ('speechSynthesis' in window) {
      setSpeakingPhrase(phraseId);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingPhrase(null);
      speechSynthesis.speak(utterance);
      
      setCategories(prev => prev.map(cat => ({
        ...cat,
        phrases: cat.phrases.map(p => 
          p.id === phraseId ? { ...p, useCount: p.useCount + 1 } : p
        )
      })));
    }
  };

  const addPhrase = () => {
    if (!newPhrase.trim()) return;
    
    const phrase: Phrase = {
      id: Date.now().toString(),
      text: newPhrase.trim(),
      language: 'en',
      useCount: 0,
      isPinned: false,
      createdAt: Date.now()
    };
    
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory 
        ? { ...cat, phrases: [phrase, ...cat.phrases] }
        : cat
    ));
    
    setNewPhrase('');
    setShowAddPhrase(false);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      color: 'gray',
      isSystem: false,
      phrases: []
    };
    
    setCategories(prev => [...prev, category]);
    setNewCategoryName('');
    setShowAddCategory(false);
    setSelectedCategory(category.id);
  };

  const deletePhrase = (phraseId: string) => {
    if (confirm('Delete this phrase?')) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        phrases: cat.phrases.filter(p => p.id !== phraseId)
      })));
    }
  };

  const togglePin = (phraseId: string) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      phrases: cat.phrases.map(p => 
        p.id === phraseId ? { ...p, isPinned: !p.isPinned } : p
      )
    })));
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const sortedPhrases = currentCategory?.phrases || [];

  const filteredPhrases = searchQuery.trim() 
    ? sortedPhrases.filter(phrase =>
        phrase.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedPhrases;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-6"
          aria-label="Go back to mute portal"
        >
          <ArrowLeft size={24} aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <MessageCircle size={24} className="text-green-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Preset Phrases Dictionary</h1>
            <p className="text-gray-600">Organized phrases for instant communication</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
            aria-label="Add new category"
          >
            <Plus size={16} />
            <span>New Category</span>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-current={selectedCategory === category.id ? 'page' : undefined}
            >
              <span className="text-sm font-medium">{category.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-blue-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.phrases.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Dictionary */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentCategory?.name}
              </h2>
              <p className="text-gray-600">
                {filteredPhrases.length} phrases • Click any phrase to speak it instantly
              </p>
            </div>
            <button
              onClick={() => setShowAddPhrase(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              aria-label="Add new phrase"
            >
              <Plus size={16} />
              <span>Add Phrase</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPhrases.map((phrase) => (
              <div key={phrase.id} className="group relative">
                <button
                  onClick={() => speakPhrase(phrase.text, phrase.id)}
                  className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:-translate-y-0.5"
                  aria-label={`Speak phrase: ${phrase.text}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {phrase.isPinned && <Pin size={12} className="text-blue-600" />}
                      <span className="text-gray-900 font-medium">{phrase.text}</span>
                    </div>
                    <Volume2 
                      size={16} 
                      className={`transition-opacity duration-200 ${
                        speakingPhrase === phrase.id 
                          ? 'text-blue-600 opacity-100 animate-pulse' 
                          : 'text-blue-600 opacity-0 group-hover:opacity-100'
                      }`}
                      aria-hidden="true" 
                    />
                  </div>
                </button>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === phrase.id ? null : phrase.id);
                    }}
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50"
                    aria-label="More options"
                  >
                    <MoreHorizontal size={12} className="text-gray-600" />
                  </button>
                  
                  {showMenu === phrase.id && (
                    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(phrase.id);
                          setShowMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Pin size={12} />
                        <span>{phrase.isPinned ? 'Unpin' : 'Pin'}</span>
                      </button>
                      
                      {!currentCategory?.isSystem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePhrase(phrase.id);
                            setShowMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Phrase Modal */}
      {showAddPhrase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add New Phrase</h3>
              <button
                onClick={() => setShowAddPhrase(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phrase Text
                </label>
                <textarea
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  placeholder="Enter your phrase..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={addPhrase}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Phrase
                </button>
                <button
                  onClick={() => {
                    if (newPhrase.trim()) {
                      speakPhrase(newPhrase, 'test');
                    }
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Test
                </button>
                <button
                  onClick={() => setShowAddPhrase(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add New Category</h3>
              <button
                onClick={() => setShowAddCategory(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={addCategory}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Create Category
                </button>
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetPhrases;