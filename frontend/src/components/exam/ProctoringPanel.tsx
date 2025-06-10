'use client';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Mic, 
  Eye, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ProctoringPanelProps {
  isActive: boolean;
  warnings: string[];
}

export default function ProctoringPanel({ isActive, warnings }: ProctoringPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Proctoring Status
        </h4>
        <Badge variant={isActive ? "default" : "destructive"} className="text-xs">
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {isActive && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Camera className="h-3 w-3" />
              <span>Camera</span>
            </div>
            <CheckCircle className="h-3 w-3 text-green-600" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Mic className="h-3 w-3" />
              <span>Microphone</span>
            </div>
            <CheckCircle className="h-3 w-3 text-green-600" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>Face Detection</span>
            </div>
            <CheckCircle className="h-3 w-3 text-green-600" />
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Warnings: {warnings.length}</strong>
            <br />
            Latest: {warnings[warnings.length - 1]}
          </AlertDescription>
        </Alert>
      )}

      {!isActive && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Proctoring is not active. Please enable camera and microphone access.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}