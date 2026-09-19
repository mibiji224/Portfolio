import { useState } from 'react'
import { Hammer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/* ---------------------------------------------------------------------------
 * TEMPORARY -- remove once the design is final.
 *
 * To take it down, delete this file and its two lines in src/App.jsx (the
 * import, and <UnderConstructionNotice /> in Portfolio). Nothing else refers
 * to it, and nothing else needs changing.
 *
 * It opens on every visit by design: there is no localStorage or
 * sessionStorage flag, so a reload shows it again. If you would rather it
 * appear once per browser session, see the note by `useState` below.
 * ------------------------------------------------------------------------ */
export default function UnderConstructionNotice() {
  // Open on mount, every load. For once-per-session instead, swap this for:
  //   useState(() => !sessionStorage.getItem('wip-seen'))
  // and set that key in onOpenChange.
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-md p-6 sm:p-7"
        // The hero animates in behind this; letting focus jump to the button
        // rather than the close X makes the primary action the obvious one.
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          event.currentTarget.querySelector('[data-wip-dismiss]')?.focus()
        }}
      >
        <DialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-matcha">
            <Hammer className="h-5 w-5 text-matcha-strong" aria-hidden="true" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            This site is still under construction
          </DialogTitle>
          <DialogDescription className="pt-1 text-sm leading-relaxed">
            I&apos;m finalizing the design, so a few sections are still moving around and
            some details may look unfinished. Please do have a look, and check back in a
            few days for the finished thing.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button
            data-wip-dismiss
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Have a look around
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
