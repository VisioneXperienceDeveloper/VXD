import { 
  HeroSection, 
  FeatureSection, 
  ToolsBanner, 
  ProjectCarousel, 
  ApproachMockup, 
  CollaborationPlans, 
  FAQSection 
} from '@/widgets/resume';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Features');

  return (
    <div className="flex flex-col overflow-hidden">
      <HeroSection />
      
      <FeatureSection 
        id="core-competency"
        badge={t('core.badge')}
        title={t('core.title')}
        description={t('core.desc')}
        bullets={[
          t('core.b1'),
          t('core.b2'),
          t('core.b3')
        ]}
        stats={[
          { value: t('core.s1v'), label: t('core.s1l') },
          { value: t('core.s2v'), label: t('core.s2l') },
          { value: t('core.s3v'), label: t('core.s3l') }
        ]}
      />

      <FeatureSection 
        id="chrome-extensions"
        reverse
        badge={t('chrome.badge')}
        title={t('chrome.title')}
        description={t('chrome.desc')}
        bullets={[
          t('chrome.b1'),
          t('chrome.b2'),
          t('chrome.b3')
        ]}
        stats={[
          { value: t('chrome.s1v'), label: t('chrome.s1l') },
          { value: t('chrome.s2v'), label: t('chrome.s2l') },
          { value: t('chrome.s3v'), label: t('chrome.s3l') }
        ]}
      />

      <ToolsBanner />

      <FeatureSection 
        id="vxd-blog"
        badge={t('vxd.badge')}
        title={t('vxd.title')}
        description={t('vxd.desc')}
        bullets={[
          t('vxd.b1'),
          t('vxd.b2'),
          t('vxd.b3')
        ]}
        stats={[
          { value: t('vxd.s1v'), label: t('vxd.s1l') },
          { value: t('vxd.s2v'), label: t('vxd.s2l') },
          { value: t('vxd.s3v'), label: t('vxd.s3l') }
        ]}
        cta={{
          label: useTranslations('Resume')('readBlog'),
          href: process.env.NODE_ENV === 'production' ? 'https://vxd-blog-web.vercel.app' : 'http://localhost:5100',
          external: true
        }}
      />

      <FeatureSection 
        id="mindtap"
        reverse
        badge={t('mindtap.badge')}
        title={t('mindtap.title')}
        description={t('mindtap.desc')}
        bullets={[
          t('mindtap.b1'),
          t('mindtap.b2'),
          t('mindtap.b3')
        ]}
        stats={[
          { value: t('mindtap.s1v'), label: t('mindtap.s1l') },
          { value: t('mindtap.s2v'), label: t('mindtap.s2l') },
          { value: t('mindtap.s3v'), label: t('mindtap.s3l') }
        ]}
      />

      <ProjectCarousel />

      <ApproachMockup />

      <CollaborationPlans />

      <FAQSection />
    </div>
  );
}
