import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dialogs = () => {
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [isSlideInOpen, setIsSlideInOpen] = useState(false);

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Dialogs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Confirmation Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Confirmation Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to perform this action?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Full-Screen Modal */}
        <Button onClick={() => setIsFullScreenOpen(true)}>
          Open Full-Screen Modal
        </Button>

        {/* Slide-in Panel */}
        <Button onClick={() => setIsSlideInOpen(true)}>
          Open Slide-in Panel
        </Button>

        {/* Alert Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Alert Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="text-yellow-500 mr-2" size={24} />
                Warning
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to proceed?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Proceed</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Form Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Form Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Form</DialogTitle>
            </DialogHeader>
            <form>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Input id="message" />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">Send</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Image Preview Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Image Preview</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <img src="https://via.placeholder.com/800x600" alt="Preview" className="w-full rounded-lg" />
            <Button variant="ghost" className="absolute top-2 right-2">
              <X size={24} />
            </Button>
          </DialogContent>
        </Dialog>

        {/* Info Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Info Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Info className="text-blue-500 mr-2" size={24} />
                Information
              </DialogTitle>
              <DialogDescription>
                This is an informational message to provide additional context or instructions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Help Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Help Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <HelpCircle className="text-teal-500 mr-2" size={24} />
                Need Help?
              </DialogTitle>
              <DialogDescription>
                Here are some quick tips to get you started:
              </DialogDescription>
            </DialogHeader>
            <ul className="list-disc list-inside mb-6">
              <li>Tip 1: Lorem ipsum dolor sit amet</li>
              <li>Tip 2: Consectetur adipiscing elit</li>
              <li>Tip 3: Sed do eiusmod tempor incididunt</li>
            </ul>
            <DialogFooter>
              <Button>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isFullScreenOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Full-Screen Modal</h2>
              <Button variant="ghost" onClick={() => setIsFullScreenOpen(false)}>
                <X />
              </Button>
            </div>
            <p className="mb-4">This is a full-screen modal for displaying large content or forms.</p>
          </div>
        </div>
      )}

      {isSlideInOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Slide-in Panel</h3>
              <Button variant="ghost" onClick={() => setIsSlideInOpen(false)}>
                <X />
              </Button>
            </div>
            <p>This panel slides in from the side to display additional information or options.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dialogs;