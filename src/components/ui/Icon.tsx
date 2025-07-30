import React from 'react';
import { clsx } from 'clsx';
import {
  PlayIcon as PlayIconOutline,
  PauseIcon as PauseIconOutline,
  ForwardIcon as ForwardIconOutline,
  BackwardIcon as BackwardIconOutline,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  HeartIcon as HeartIconOutline,
  ShareIcon as ShareIconOutline,
  ListBulletIcon,
  MusicalNoteIcon,
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  Cog6ToothIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  CameraIcon,
  WifiIcon,
  SignalIcon,
  Battery0Icon,
  MoonIcon,
  SunIcon,
  CloudIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
  KeyIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  GiftIcon,
  TrophyIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gray' | 'red' | 'green' | 'yellow' | 'blue' | 'purple' | 'pink' | 'inherit';
  variant?: 'outline' | 'solid';
  className?: string;
  onClick?: () => void;
}

const iconMap = {
  play: PlayIconOutline,
  pause: PauseIconOutline,
  forward: ForwardIconOutline,
  backward: BackwardIconOutline,
  speaker: SpeakerWaveIcon,
  speakerOff: SpeakerXMarkIcon,
  home: HomeIconOutline,
  user: UserIconOutline,
  settings: Cog6ToothIcon,
  list: ListBulletIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  heart: HeartIconOutline,
  share: ShareIconOutline,
  close: XMarkIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  search: MagnifyingGlassIcon,
  more: EllipsisHorizontalIcon,
  music: MusicalNoteIcon,
  star: StarIcon,
  bookmark: BookmarkIcon,
  clock: ClockIcon,
  calendar: CalendarIcon,
  phone: PhoneIcon,
  email: EnvelopeIcon,
  location: MapPinIcon,
  link: LinkIcon,
  globe: GlobeAltIcon,
  document: DocumentTextIcon,
  photo: PhotoIcon,
  video: VideoCameraIcon,
  microphone: MicrophoneIcon,
  camera: CameraIcon,
  wifi: WifiIcon,
  signal: SignalIcon,
  battery: Battery0Icon,
  moon: MoonIcon,
  sun: SunIcon,
  cloud: CloudIcon,
  sparkles: SparklesIcon,
  fire: FireIcon,
  bolt: BoltIcon,
  eye: EyeIcon,
  eyeOff: EyeSlashIcon,
  lock: LockClosedIcon,
  unlock: LockOpenIcon,
  key: KeyIcon,
  shield: ShieldCheckIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
  question: QuestionMarkCircleIcon,
  lightbulb: LightBulbIcon,
  gift: GiftIcon,
  trophy: TrophyIcon
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'inherit',
  className,
  onClick
}) => {
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10'
  };
  
  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    accent: 'text-moonwave-400',
    white: 'text-white',
    gray: 'text-gray-400',
    red: 'text-red-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    inherit: 'text-inherit'
  };

  return (
    <IconComponent
      className={clsx(
        sizeClasses[size],
        colorClasses[color],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    />
  );
};

// 특화된 아이콘 컴포넌트들
export const PlayIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="play" />;
export const PauseIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="pause" />;
export const ForwardIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="forward" />;
export const BackwardIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="backward" />;
export const HeartIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="heart" />;
export const ShareIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="share" />;
export const MusicIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="music" />;
export const HomeIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="home" />;
export const UserIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="user" />;
export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="settings" />;
export const CloseIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="close" />;
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="search" />;
export const MoreIcon = (props: Omit<IconProps, 'name'>) => <Icon {...props} name="more" />;