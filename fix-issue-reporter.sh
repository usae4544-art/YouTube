#!/bin/bash
sed -i 's/import { motion, AnimatePresence } from "framer-motion";/import { motion, AnimatePresence } from "motion\/react";\nimport VirtualKeyboard from ".\/VirtualKeyboard";/g' src/components/IssueReporter.tsx
