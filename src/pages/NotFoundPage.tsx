import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-moonwave-900 via-moonwave-800 to-moonwave-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center space-y-6">
          {/* 404 Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-moonwave-500 to-moonwave-600 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">404</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">!</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <Typography variant="h2" className="text-moonwave-600">
              페이지를 찾을 수 없습니다
            </Typography>
            
            <Typography variant="body" className="text-gray-600">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </Typography>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
              >
                <HomeIcon className="w-5 h-5" />
                홈으로 돌아가기
              </Button>
            </Link>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              이전 페이지
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200">
            <Typography variant="caption" className="text-gray-500">
              문제가 지속되면 문의해 주세요
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;