import React from 'react';
import './Common.css';
import 'semantic-ui-css/semantic.min.css';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from 'date-fns/locale/ja';
import "react-datepicker/dist/react-datepicker.css";
import addDays from 'date-fns/addDays';
import axios from 'axios';
import format from 'date-fns/format';
import Result from './Result';

const Today = new Date();
registerLocale('ja', ja);

class Home extends React.Component {
  state = {
    date: addDays(new Date(), 14),
    budget: '12000',
    departure: '1',
    duration: '90',
    plansCount: 0,
    plans: null,
    error: null
  }

  onFormSubmit = async (event) => {
    try {
      event.preventDefault();

      const response = await axios.get(
        'https://l1kwik11ne.execute-api.ap-northeast-1.amazonaws.com/production/golf-courses',
        {
          params: {
            date: format(this.state.date, 'yyyyMMdd'),
            budget: this.state.budget,
            departure: this.state.departure,
            duration: this.state.duration
          }
        }
      );
      this.setState({
        planCount: response.data.count,
        plans: response.data.plans
      });
    } catch (e) {
      this.setState({ error: e });
    }
  }

  render() {
    return (
      <div className="ui container" id="container">
        <div className="Search__Form">
          <form className="ui form segment" onSubmit={this.onFormSubmit}>
            <div className="field">
              <label><i className="calendar alternate outline icon"></i>プレー日</label>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                locale='ja'
                selected={this.state.date}
                minDate={e => this.setState({ date: e })}
              />
            </div>
            <div className="field">
              <label><i className="yen sign icon"></i>上限金額</label>
              <select className="ui dropdown" name="dropdown" value={this.state.budget} onChange={e => this.setState({ budger: e.target.value })} >
              <option value="8000">8,000円</option>
              <option value="12000">12,000円</option>
              <option value="16000">16,000円</option>
              </select>
            </div>
            <div className="field">
              <label><i className="map pin icon"></i>移動時間計算の出発地点(自宅から近い地点をお選びください)</label>
              <select className="ui dropdown" name="dropdown" value={this.state.departure} onChange={e => this.setState({ departure: e.target.value })} >
              <option value="1">東京駅</option>
              <option value="2">横浜駅</option>
              </select>
            </div>
            <div className="field">
              <label><i className="car icon"></i>車での移動時間の上限</label>
              <select className="ui dropdown" name="dropdown" value={this.state.duration} onChange={e => this.setState({ duration: e.target.value })}>
              <option value="60">60分</option>
              <option value="90">90分</option>
              <option value="120">120分</option>
              </select>
            </div>
            <div className="Search__Button">
              <button type="submit" className="Search__Button__Design">
                <i className="search icon"></i>ゴルフ場を検索する
              </button>
            </div>
          </form>
          <Result
            plans={this.state.plans}
            planCount={this.state.planCount}
            error={this.state.error}
          />
        </div>
      </div>
    );
  }
}

export default Home;