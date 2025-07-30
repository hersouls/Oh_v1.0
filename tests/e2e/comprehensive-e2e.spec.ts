import { test, expect } from '@playwright/test';

test.describe('Comprehensive E2E Tests for Oh Anna Music Player', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 홈페이지로 이동
    await page.goto('/');
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
  });

  test.describe('Intro Flow Tests', () => {
    test('should display intro page with start button', async ({ page }) => {
      // 인트로 페이지가 로드되었는지 확인
      await expect(page.locator('[data-testid="intro-page"]')).toBeVisible();
      
      // 시작 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="start-button"]')).toBeVisible();
      
      // 인트로 페이지의 주요 콘텐츠 확인
      await expect(page.locator('[data-testid="intro-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="intro-description"]')).toBeVisible();
    });

    test('should navigate to tracks page when start button is clicked', async ({ page }) => {
      // 시작 버튼 클릭
      await page.click('[data-testid="start-button"]');
      
      // URL이 /tracks로 변경되었는지 확인
      await expect(page).toHaveURL('/tracks');
      
      // 트랙 페이지가 로드되었는지 확인
      await expect(page.locator('[data-testid="tracks-page"]')).toBeVisible();
    });

    test('should navigate to about page', async ({ page }) => {
      // About 페이지로 직접 이동
      await page.goto('/about');
      
      // About 페이지가 로드되었는지 확인
      await expect(page.locator('[data-testid="about-page"]')).toBeVisible();
      
      // About 페이지의 주요 콘텐츠 확인
      await expect(page.locator('[data-testid="about-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="about-description"]')).toBeVisible();
    });
  });

  test.describe('Tracks Page Tests', () => {
    test('should display tracks list with all 13 tracks', async ({ page }) => {
      // 트랙 페이지로 이동
      await page.goto('/tracks');
      
      // 트랙 페이지가 로드되었는지 확인
      await expect(page.locator('[data-testid="tracks-page"]')).toBeVisible();
      
      // 트랙 리스트가 표시되는지 확인
      await expect(page.locator('[data-testid="tracks-list"]')).toBeVisible();
      
      // 13개의 트랙이 모두 표시되는지 확인
      const trackItems = page.locator('[data-testid="track-item"]');
      await expect(trackItems).toHaveCount(13);
    });

    test('should display track information correctly', async ({ page }) => {
      await page.goto('/tracks');
      
      // 첫 번째 트랙의 정보 확인
      const firstTrack = page.locator('[data-testid="track-item"]').first();
      
      // 트랙 제목이 표시되는지 확인
      await expect(firstTrack.locator('[data-testid="track-title"]')).toBeVisible();
      
      // 트랙 아티스트가 표시되는지 확인
      await expect(firstTrack.locator('[data-testid="track-artist"]')).toBeVisible();
      
      // 트랙 재생 시간이 표시되는지 확인
      await expect(firstTrack.locator('[data-testid="track-duration"]')).toBeVisible();
    });

    test('should navigate to track detail page when track is clicked', async ({ page }) => {
      await page.goto('/tracks');
      
      // 첫 번째 트랙 클릭
      const firstTrack = page.locator('[data-testid="track-item"]').first();
      await firstTrack.click();
      
      // 트랙 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/track\/\d+/);
      
      // 트랙 상세 페이지가 로드되었는지 확인
      await expect(page.locator('[data-testid="track-detail-page"]')).toBeVisible();
    });
  });

  test.describe('Track Detail Page Tests', () => {
    test('should display track detail information', async ({ page }) => {
      // 첫 번째 트랙 상세 페이지로 이동
      await page.goto('/track/1');
      
      // 트랙 상세 페이지가 로드되었는지 확인
      await expect(page.locator('[data-testid="track-detail-page"]')).toBeVisible();
      
      // 트랙 제목이 표시되는지 확인
      await expect(page.locator('[data-testid="track-detail-title"]')).toBeVisible();
      
      // 트랙 아티스트가 표시되는지 확인
      await expect(page.locator('[data-testid="track-detail-artist"]')).toBeVisible();
      
      // 트랙 설명이 표시되는지 확인
      await expect(page.locator('[data-testid="track-detail-description"]')).toBeVisible();
    });

    test('should display lyrics when available', async ({ page }) => {
      await page.goto('/track/1');
      
      // 가사 섹션이 표시되는지 확인
      const lyricsSection = page.locator('[data-testid="lyrics-section"]');
      if (await lyricsSection.isVisible()) {
        await expect(page.locator('[data-testid="lyrics-content"]')).toBeVisible();
      }
    });

    test('should have back navigation', async ({ page }) => {
      await page.goto('/track/1');
      
      // 뒤로가기 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="back-button"]')).toBeVisible();
      
      // 뒤로가기 버튼 클릭
      await page.click('[data-testid="back-button"]');
      
      // 트랙 리스트 페이지로 돌아갔는지 확인
      await expect(page).toHaveURL('/tracks');
    });
  });

  test.describe('Music Player Tests', () => {
    test('should display music player controls', async ({ page }) => {
      // 트랙 페이지로 이동 (플레이어가 표시되는 페이지)
      await page.goto('/tracks');
      
      // 음악 플레이어가 표시되는지 확인
      await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
      
      // 재생/일시정지 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="play-pause-button"]')).toBeVisible();
      
      // 이전/다음 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="prev-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="next-button"]')).toBeVisible();
      
      // 진행률 바가 표시되는지 확인
      await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
      
      // 볼륨 컨트롤이 표시되는지 확인
      await expect(page.locator('[data-testid="volume-control"]')).toBeVisible();
    });

    test('should play and pause music', async ({ page }) => {
      await page.goto('/tracks');
      
      // 재생 버튼 클릭
      await page.click('[data-testid="play-pause-button"]');
      
      // 재생 상태로 변경되었는지 확인
      await expect(page.locator('[data-testid="pause-icon"]')).toBeVisible();
      
      // 일시정지 버튼 클릭
      await page.click('[data-testid="play-pause-button"]');
      
      // 일시정지 상태로 변경되었는지 확인
      await expect(page.locator('[data-testid="play-icon"]')).toBeVisible();
    });

    test('should navigate between tracks', async ({ page }) => {
      await page.goto('/tracks');
      
      // 현재 트랙 정보 저장
      const currentTrackInfo = await page.locator('[data-testid="current-track-info"]').textContent();
      
      // 다음 트랙 버튼 클릭
      await page.click('[data-testid="next-button"]');
      
      // 트랙 정보가 변경되었는지 확인
      await expect(page.locator('[data-testid="current-track-info"]')).not.toHaveText(currentTrackInfo!);
      
      // 이전 트랙 버튼 클릭
      await page.click('[data-testid="prev-button"]');
      
      // 원래 트랙으로 돌아갔는지 확인
      await expect(page.locator('[data-testid="current-track-info"]')).toHaveText(currentTrackInfo!);
    });

    test('should adjust volume', async ({ page }) => {
      await page.goto('/tracks');
      
      // 볼륨 슬라이더 찾기
      const volumeSlider = page.locator('[data-testid="volume-slider"]');
      await expect(volumeSlider).toBeVisible();
      
      // 볼륨을 50%로 설정
      await volumeSlider.fill('50');
      
      // 볼륨이 변경되었는지 확인
      await expect(volumeSlider).toHaveValue('50');
    });

    test('should update progress bar during playback', async ({ page }) => {
      await page.goto('/tracks');
      
      // 재생 시작
      await page.click('[data-testid="play-pause-button"]');
      
      // 3초 대기
      await page.waitForTimeout(3000);
      
      // 진행률이 업데이트되었는지 확인
      const progressBar = page.locator('[data-testid="progress-bar"]');
      const progressValue = await progressBar.getAttribute('aria-valuenow');
      expect(parseInt(progressValue || '0')).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation Tests', () => {
    test('should navigate between all pages', async ({ page }) => {
      // 홈페이지에서 시작
      await expect(page.locator('[data-testid="intro-page"]')).toBeVisible();
      
      // 트랙 페이지로 이동
      await page.goto('/tracks');
      await expect(page.locator('[data-testid="tracks-page"]')).toBeVisible();
      
      // About 페이지로 이동
      await page.goto('/about');
      await expect(page.locator('[data-testid="about-page"]')).toBeVisible();
      
      // 홈페이지로 돌아가기
      await page.goto('/');
      await expect(page.locator('[data-testid="intro-page"]')).toBeVisible();
    });

    test('should handle 404 page for invalid routes', async ({ page }) => {
      // 존재하지 않는 페이지로 이동
      await page.goto('/invalid-route');
      
      // 404 페이지가 표시되는지 확인
      await expect(page.locator('[data-testid="not-found-page"]')).toBeVisible();
      
      // 홈으로 돌아가기 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="go-home-button"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design Tests', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      // 모바일 뷰포트 설정
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/tracks');
      
      // 모바일에서도 플레이어가 표시되는지 확인
      await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
      
      // 모바일에서도 트랙 리스트가 표시되는지 확인
      await expect(page.locator('[data-testid="tracks-list"]')).toBeVisible();
    });

    test('should display correctly on tablet devices', async ({ page }) => {
      // 태블릿 뷰포트 설정
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/tracks');
      
      // 태블릿에서도 모든 요소가 표시되는지 확인
      await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
      await expect(page.locator('[data-testid="tracks-list"]')).toBeVisible();
    });

    test('should display correctly on desktop devices', async ({ page }) => {
      // 데스크톱 뷰포트 설정
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto('/tracks');
      
      // 데스크톱에서도 모든 요소가 표시되는지 확인
      await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
      await expect(page.locator('[data-testid="tracks-list"]')).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // 페이지 로드 시간이 3초 이내인지 확인
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle audio loading efficiently', async ({ page }) => {
      await page.goto('/tracks');
      
      // 재생 버튼 클릭
      await page.click('[data-testid="play-pause-button"]');
      
      // 오디오 로딩 시간 측정
      const audioLoadTime = await page.evaluate(() => {
        const audio = document.querySelector('audio');
        if (audio) {
          return new Promise((resolve) => {
            audio.addEventListener('canplay', () => resolve(Date.now()), { once: true });
          });
        }
        return 0;
      });
      
      // 오디오 로딩 시간이 5초 이내인지 확인
      expect(audioLoadTime).toBeLessThan(5000);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/tracks');
      
      // 재생 버튼에 aria-label이 있는지 확인
      const playButton = page.locator('[data-testid="play-pause-button"]');
      await expect(playButton).toHaveAttribute('aria-label');
      
      // 진행률 바에 적절한 ARIA 속성이 있는지 확인
      const progressBar = page.locator('[data-testid="progress-bar"]');
      await expect(progressBar).toHaveAttribute('role', 'progressbar');
      await expect(progressBar).toHaveAttribute('aria-valuemin');
      await expect(progressBar).toHaveAttribute('aria-valuemax');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/tracks');
      
      // Tab 키로 포커스 이동
      await page.keyboard.press('Tab');
      
      // 재생 버튼이 포커스 가능한지 확인
      const playButton = page.locator('[data-testid="play-pause-button"]');
      await expect(playButton).toBeFocused();
      
      // Enter 키로 재생
      await page.keyboard.press('Enter');
      await expect(page.locator('[data-testid="pause-icon"]')).toBeVisible();
    });
  });
});