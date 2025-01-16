# Journal App

## Overview

This is a basic working version of a journaling app built with Typescript, React, and Electron.

It is light-weight, easily built, and simple to use.

## Shortcuts:

Ctrl+[ -> Go to previous day
Ctrl+] -> Go to next day
Ctrl+T -> Go to Today
Ctrl+S -> Save entry for open day
Ctrl+D -> Clear entry for open day

## Storage

The entries are stored on your local disk using an IndexedDB. Since only date keys and plaintext entries are being saved, there is a minimal amount of data being stored.

In the case that this is used for multiple years, I will have probably figured something else out by then.

