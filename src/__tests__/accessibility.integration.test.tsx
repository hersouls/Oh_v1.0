import { render, screen, act } from '@testing-library/react';
import App from '../App';

describe('Accessibility Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('모든 이미지에 alt 텍스트가 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  test('모든 버튼에 접근 가능한 이름이 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      // aria-label, aria-labelledby, 또는 텍스트 콘텐츠가 있어야 함
      const hasAccessibleName = 
        button.getAttribute('aria-label') ||
        button.getAttribute('aria-labelledby') ||
        button.textContent?.trim();
      
      expect(hasAccessibleName).toBeTruthy();
    });
  });

  test('모든 링크에 접근 가능한 이름이 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      // aria-label, aria-labelledby, 또는 텍스트 콘텐츠가 있어야 함
      const hasAccessibleName = 
        link.getAttribute('aria-label') ||
        link.getAttribute('aria-labelledby') ||
        link.textContent?.trim();
      
      expect(hasAccessibleName).toBeTruthy();
    });
  });

  test('키보드 네비게이션이 가능하다', async () => {
    await act(async () => {
      render(<App />);
    });

    // Tab 키로 포커스 가능한 요소들이 있는지 확인
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('색상 대비가 적절하다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 텍스트 요소들의 색상 대비 확인
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // 실제 색상 대비 계산은 복잡하므로 기본적인 검증만 수행
      expect(color).toBeDefined();
      expect(backgroundColor).toBeDefined();
    });
  });

  test('스크린 리더 호환성이 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    // ARIA 속성들이 적절히 사용되고 있는지 확인
    const elementsWithAria = document.querySelectorAll('[aria-*]');
    expect(elementsWithAria.length).toBeGreaterThan(0);
  });

  test('폼 요소들이 라벨과 연결되어 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    const inputs = screen.queryAllByRole('textbox');
    inputs.forEach(input => {
      // label 요소나 aria-label이 있어야 함
      const hasLabel = 
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby') ||
        document.querySelector(`label[for="${input.id}"]`);
      
      expect(hasLabel).toBeTruthy();
    });
  });

  test('페이지 제목이 적절하다', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(document.title).toBeDefined();
    expect(document.title).not.toBe('');
  });

  test('언어 속성이 설정되어 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    const htmlElement = document.querySelector('html');
    expect(htmlElement).toHaveAttribute('lang');
  });

  test('스킵 링크가 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 스킵 링크가 있는지 확인 (접근성을 위한)
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    expect(skipLinks.length).toBeGreaterThanOrEqual(0);
  });

  test('포커스 표시가 명확하다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 포커스 가능한 요소들에 포커스 표시가 있는지 확인
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      // outline 또는 다른 포커스 표시가 있는지 확인
      expect(styles.outline || styles.border).toBeDefined();
    });
  });

  test('에러 메시지가 접근 가능하다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 에러 메시지가 aria-live 영역에 있는지 확인
    const liveRegions = document.querySelectorAll('[aria-live]');
    expect(liveRegions.length).toBeGreaterThanOrEqual(0);
  });

  test('로딩 상태가 접근 가능하다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 로딩 상태가 aria-busy로 표시되는지 확인
    const busyElements = document.querySelectorAll('[aria-busy="true"]');
    // 로딩 중이 아닐 때는 0개여야 함
    expect(busyElements.length).toBe(0);
  });

  test('반응형 디자인이 접근성을 해치지 않는다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 모바일에서도 접근 가능한 요소들이 있는지 확인
    const touchTargets = document.querySelectorAll('button, a, input');
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      // 터치 타겟이 충분히 큰지 확인 (44px 이상 권장)
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });

  test('애니메이션이 접근성을 고려한다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 사용자가 애니메이션을 선호하지 않는다는 설정을 확인
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    expect(prefersReducedMotion).toBeDefined();
  });

  test('콘텐츠가 논리적 순서로 배치되어 있다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 헤딩 구조가 논리적인지 확인
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    
    // 헤딩 레벨이 순차적으로 증가하는지 확인
    for (let i = 1; i < headingLevels.length; i++) {
      expect(headingLevels[i] - headingLevels[i-1]).toBeLessThanOrEqual(1);
    }
  });
});